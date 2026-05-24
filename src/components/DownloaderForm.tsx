import React, { useState } from "react";
import { Copy, Clipboard, ArrowRight, Loader2, PlayCircle, Eye, AlertCircle } from "lucide-react";

interface DownloaderFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  directUrl?: string;
}

export default function DownloaderForm({ onAnalyze, isLoading, error, directUrl }: DownloaderFormProps) {
  const [inputValue, setInputValue] = useState(directUrl || "");

  // Detect input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = inputValue.trim();
    if (cleanUrl) {
      onAnalyze(cleanUrl);
    }
  };

  // Safe Clipboard read with support for standard browser actions
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputValue(text);
        }
      } else {
        // Fallback or warning if iframe permission block
        alert("Bhai, copy-paste automatic work nahi kar raha is device par. Please box me koshish karke ya CTRL+V / long-press karke link paste karein!");
      }
    } catch (e) {
      console.warn("Clipboard access rejected or unavailable in this iframe environment:", e);
      alert("Bhai, clipboard access blocked lag raha hai. Please input box par touch/click karke manual CTRL+V ya long-press se link paste karein!");
    }
  };

  // Preset links to let the user play with it immediately
  const presets = [
    { label: "🌅 Scenic Reel", url: "https://www.instagram.com/reel/C8_scenic_forest/" },
    { label: "🌴 Beach Post", url: "https://www.instagram.com/p/C9_coastal_beach/" },
    { label: "🐱 Cute Cat Reel", url: "https://www.instagram.com/reel/C7_cozy_cat/" },
    { label: "🌃 Cyberpunk Carousel", url: "https://www.instagram.com/p/C6_cyber_carousel/?carousel=true" },
    { label: "🎵 Audio Track", url: "https://www.instagram.com/reels/audio/189234567/" }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 relative overflow-hidden">
      
      {/* Visual background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        <h1 className="text-2xl sm:text-4xl font-sans font-extrabold text-slate-900 tracking-tight leading-tight">
          Instagram Content Downloader
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-sans font-medium">
          Download Instagram Reels, Posts, Carousel Photos & Audios securely
        </p>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        
        <div className="relative flex items-center">
          
          <input
            type="text"
            placeholder="Paste Instagram URL here... (e.g. instagram.com/reels/...)"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full p-4 pl-4 pr-24 sm:pr-32 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-75 transition-all duration-300 font-sans"
          />

          {/* Action Tools aligned directly inside the bar */}
          <div className="absolute right-2 flex items-center space-x-1.5">
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="text-xs bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg transition-all"
              >
                Clear
              </button>
            )}
            
            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:flex items-center space-x-1 text-xs bg-white border border-slate-200 hover:border-indigo-500/40 text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-xl transition-all duration-300"
              title="Clipboard paste"
            >
              <Clipboard className="h-3 w-3" />
              <span>Paste</span>
            </button>
          </div>

        </div>

        {/* Clear feedback for errors */}
        {error && (
          <div className="flex items-center space-x-2.5 text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Download triggering button */}
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="w-full relative group p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Analyzing content link...</span>
            </>
          ) : (
            <>
              <span>Analyze Content Link</span>
              <ArrowRight className="h-4 w-4 text-white stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

      </form>

      {/* Presets and Samples */}
      <div className="mt-6 relative z-10 pt-4 border-t border-slate-100">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-3 text-center sm:text-left font-bold">
          Quick Demo Presets (Test instantly without a real link):
        </span>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(p.url);
                onAnalyze(p.url);
              }}
              disabled={isLoading}
              className="text-[11px] bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center space-x-1 font-sans font-medium"
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
