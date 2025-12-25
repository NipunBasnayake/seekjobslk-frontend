import { useEffect, useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Snowfall from "react-snowfall";
import ChristmasPopup from "@/components/ChristmasPopup";

import Index from "./pages/Index";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const seenPopup = localStorage.getItem("christmas-popup-seen");
    if (!seenPopup) {
      setShowPopup(true);
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem("christmas-popup-seen", "true");
    setShowPopup(false);
  };

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>

            {showPopup && <ChristmasPopup onClose={closePopup} />}

            <Snowfall
              color="rgba(182, 227, 252, 0.7)"
              snowflakeCount={isMobile ? 80 : 120}
              radius={[1, 2.5]}
              speed={isMobile ? [0.3, 1.3] : [0.8, 2]}
              wind={isMobile ? [-0.1, 0.3] : [-0.5, 1]}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10,
                pointerEvents: "none",
                filter: isMobile
                  ? "drop-shadow(0 0 2px rgba(182,227,252,0.3))"
                  : "drop-shadow(0 0 4px rgba(182,227,252,0.5))",
              }}
            />

            <Toaster />
            <Sonner />

            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/job/:jobId" element={<JobDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>

          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
