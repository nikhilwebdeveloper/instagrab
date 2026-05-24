import { Download, Sparkles, Flame, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function Header() {
  return (
    <header className="border-b border-slate-200/60 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div id="app-logo" className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/10">
            <Download className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              InstaGrab<span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-sans font-semibold">Premium</span>
            </span>
            <p className="text-[10px] text-slate-400 font-sans tracking-wider font-semibold uppercase">IG Media Archiver</p>
          </div>
        </div>

        {/* Feature badges (Not sidebars, beautiful visual indicators) */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>Reels</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>HQ MP3</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Anti-Blocking</span>
          </div>
        </div>

        {/* Dynamic Status Pill */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-xs font-sans font-medium text-slate-600">Fast Mode</span>
          </div>
        </div>

      </div>
    </header>
  );
}
