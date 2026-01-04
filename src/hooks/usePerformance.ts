import { useEffect } from "react";
import { trackWebVitals, sendMetricsToAnalytics, WebVital } from "@/lib/webVitals";

export const useWebVitals = () => {
  useEffect(() => {
    const cleanup = trackWebVitals((metric: WebVital) => {
      console.debug(`[Web Vitals] ${metric.name}:`, metric);

      sendMetricsToAnalytics(metric);
    });

    return cleanup;
  }, []);
};

export const useIdleTask = (callback: () => void, dependencies: any[] = []) => {
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => {
        callback();
      });

      return () => cancelIdleCallback(id);
    } else {
      const timeoutId = setTimeout(callback, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, dependencies);
};

export const usePrefetch = (urls: string[], rel: string = "prefetch") => {
  useEffect(() => {
    const prefetchLinks = urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = url;
      document.head.appendChild(link);
    });

    return () => {
      document.querySelectorAll(`link[rel="${rel}"]`).forEach((el) => el.remove());
    };
  }, [urls, rel]);
};

export const usePreloadCriticalResources = (urls: string[]) => {
  useEffect(() => {
    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      
      if (url.endsWith(".woff2")) {
        link.as = "font";
        link.crossOrigin = "anonymous";
      } else if (url.endsWith(".jpg") || url.endsWith(".png")) {
        link.as = "image";
      } else if (url.endsWith(".js")) {
        link.as = "script";
      } else if (url.endsWith(".css")) {
        link.as = "style";
      }

      link.href = url;
      document.head.appendChild(link);
    });
  }, [urls]);
};

export const useMonitorLongTasks = () => {
  useEffect(() => {
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            console.warn(`[Long Task] ${entry.duration}ms`, entry);
          });
        });

        observer.observe({ entryTypes: ["longtask"] });

        return () => observer.disconnect();
      } catch (e) {
        console.debug("Long task monitoring not supported");
      }
    }
  }, []);
};
