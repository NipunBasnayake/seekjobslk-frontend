import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enable performance monitoring in production
if (process.env.NODE_ENV === "production") {
  // Use dynamic import to avoid blocking
  import("@/lib/webVitals").then(({ trackWebVitals, sendMetricsToAnalytics }) => {
    trackWebVitals((metric) => {
      sendMetricsToAnalytics(metric);
    });
  });
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(<App />);
