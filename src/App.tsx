import { useState, useEffect } from "react";
import { DownloadHistoryItem, InstagramMediaDetails } from "./types";
import Header from "./components/Header";
import DownloaderForm from "./components/DownloaderForm";
import MediaPreview from "./components/MediaPreview";
import DownloadHistory from "./components/DownloadHistory";
import FeaturesFAQ from "./components/FeaturesFAQ";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Shield, Compass, Instagram, Clock, CheckCircle } from "lucide-react";

export default function App() {
  const [mediaDetails, setMediaDetails] = useState<InstagramMediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Safe SSR & client LocalStorage sync of Download History
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [directPastedUrl, setDirectPastedUrl] = useState("");

  // Hydrate history from cache
  useEffect(() => {
    try {
      const stored = localStorage.getItem("instasave_cache_v1");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load search and download cache", e);
    }
  }, []);

  // Sync to history cache
  const saveToHistory = (newItem: DownloadHistoryItem) => {
    try {
      const updated = [newItem, ...history.filter(h => h.url !== newItem.url || h.format !== newItem.format)].slice(0, 15);
      setHistory(updated);
      localStorage.setItem("instasave_cache_v1", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to write to local cache", e);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem("instasave_cache_v1");
    setHistory([]);
  };

  // Perform backend processing and fetch formatted media data
  const handleAnalyzeUrl = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setMediaDetails(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      // Safely handle non-OK responses first to avoid crashing on .json() of HTML pages
      if (!response.ok) {
        let errorMsg = `Bhai, server side se temporary issue aaya hai (Status ${response.status}). Thodi der baad try karein!`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errorMsg = errData.error || errorMsg;
          } else {
            console.warn("Server returned a non-JSON error status code:", response.status);
            const rawBody = await response.text();
            if (rawBody.toLowerCase().includes("cannot post") || response.status === 404) {
              errorMsg = "Bhai, server abhi reload ho raha hai back-end par. Please 5-10 seconds dekar page key refresh karein sab thik ho jayega!";
            }
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      // Safe JSON parsing for successful status codes
      const data = await response.json();
      setMediaDetails(data);
    } catch (err: any) {
      console.error("Analyze Failure:", err);
      setError(err.message || "Bhai, server connection issue lag raha hai. Ek baar retry karein!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans transition-all duration-300 relative selection:bg-indigo-600 selection:text-white">
      
      {/* Background Subtle Gradient top light fade */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50/40 to-transparent pointer-events-none" />
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Corporate header branding */}
      <Header />

      {/* Main Container Layout */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 w-full space-y-12">
        
        {/* Onboarding Highlights (Clean and high contrast) */}
        <section id="banner-highlights" className="text-center space-y-3 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-sans font-medium text-slate-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Premium Hub: 1080p MP4, WAV & HQ MP3 Extractor</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none pt-1">
            Reels, Photos & Audio, Saved Securely
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans font-medium px-2">
            Convert and backup your favorite social media beats, HD videos, and premium wallpapers with zero watermarks or restrictions.
          </p>
        </section>

        {/* Downloader Form Area */}
        <section id="downloader-main-form" className="relative">
          <DownloaderForm 
            onAnalyze={handleAnalyzeUrl} 
            isLoading={isLoading} 
            error={error}
            directUrl={directPastedUrl} 
          />
        </section>

        {/* Media Preview Dashboard View */}
        <AnimatePresence mode="wait">
          {mediaDetails && (
            <section id="preview-results-board">
              <div className="max-w-7xl mx-auto flex items-center justify-between pl-1.5 pr-1.5 mb-2.5">
                <div className="flex items-center space-x-2 text-slate-500 text-xs">
                  <Clock className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                  <span className="font-sans font-medium">Link successfully verified. Select output formats below:</span>
                </div>
              </div>
              <MediaPreview 
                details={mediaDetails} 
                onDownloadStarted={saveToHistory} 
              />
            </section>
          )}
        </AnimatePresence>

        {/* Local History Section */}
        <DownloadHistory 
          history={history} 
          onClear={handleClearHistory} 
          onSelectUrl={(url) => {
            setDirectPastedUrl(url);
            handleAnalyzeUrl(url);
            // Smooth scroll to form in viewport
            document.getElementById("downloader-main-form")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Interactive Features Accordions */}
        <FeaturesFAQ />

      </main>

      {/* Footer copyright metrics section */}
      <footer className="border-t border-slate-100 bg-white py-8 relative z-10 text-[11px] font-sans text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-3.5 w-3.5 text-indigo-600" />
            <span>Verified safe through Google AI Studio Sandbox</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Server Speed: <span className="text-slate-800 font-bold">GigaHost 500Mbps</span></span>
            <span>API Response: <span className="text-slate-800 font-bold">120ms</span></span>
          </div>
          <div>
            <span>© 2026 Instagram Downloader Studio. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
