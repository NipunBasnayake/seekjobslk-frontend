export interface WebVital {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta?: number;
  id?: string;
  navigationType?: string;
}

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FCP: { good: 1800, poor: 3000 },
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  TTFB: { good: 600, poor: 1800 },
};

const getRating = (
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" => {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return "needs-improvement";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
};

export const observeLCP = (callback: (metric: WebVital) => void) => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    const value = lastEntry.startTime + lastEntry.duration;

    callback({
      name: "LCP",
      value: Math.round(value),
      rating: getRating("LCP", value),
    });
  });

  observer.observe({ entryTypes: ["largest-contentful-paint"] });
  return observer;
};

export const observeFCP = (callback: (metric: WebVital) => void) => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const value = entry.startTime;
      callback({
        name: "FCP",
        value: Math.round(value),
        rating: getRating("FCP", value),
      });
    });
  });

  observer.observe({ entryTypes: ["paint"] });
  return observer;
};

export const observeCLS = (callback: (metric: WebVital) => void) => {
  let clsValue = 0;
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        callback({
          name: "CLS",
          value: Math.round(clsValue * 1000) / 1000,
          rating: getRating("CLS", clsValue),
        });
      }
    });
  });

  observer.observe({ entryTypes: ["layout-shift"] });
  return observer;
};

export const observeFID = (callback: (metric: WebVital) => void) => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      const value = entry.processingDuration;
      callback({
        name: "FID",
        value: Math.round(value),
        rating: getRating("FID", value),
      });
    });
  });

  observer.observe({ entryTypes: ["first-input"] });
  return observer;
};

export const getTTFB = (callback: (metric: WebVital) => void) => {
  if (performance.timing) {
    const ttfb = performance.timing.responseStart - performance.timing.fetchStart;
    callback({
      name: "TTFB",
      value: Math.round(ttfb),
      rating: getRating("TTFB", ttfb),
    });
  }
};

export const trackWebVitals = (callback: (metric: WebVital) => void) => {
  const observers: PerformanceObserver[] = [];

  try {
    const lcpObserver = observeLCP(callback);
    observers.push(lcpObserver);
  } catch (e) {
    console.warn("LCP monitoring not supported");
  }

  try {
    const fcpObserver = observeFCP(callback);
    observers.push(fcpObserver);
  } catch (e) {
    console.warn("FCP monitoring not supported");
  }

  try {
    const clsObserver = observeCLS(callback);
    observers.push(clsObserver);
  } catch (e) {
    console.warn("CLS monitoring not supported");
  }

  try {
    const fidObserver = observeFID(callback);
    observers.push(fidObserver);
  } catch (e) {
    console.warn("FID monitoring not supported");
  }

  try {
    getTTFB(callback);
  } catch (e) {
    console.warn("TTFB monitoring not supported");
  }

  return () => {
    observers.forEach((observer) => observer.disconnect());
  };
};

export const sendMetricsToAnalytics = (metric: WebVital) => {
  if (process.env.NODE_ENV === "production") {
    const body = JSON.stringify(metric);

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/metrics", body);
    } else {
      fetch("/api/metrics", {
        method: "POST",
        body,
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((err) => console.error("Failed to send metric:", err));
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[${metric.name}] ${metric.value}ms - ${metric.rating}`);
  }
};
