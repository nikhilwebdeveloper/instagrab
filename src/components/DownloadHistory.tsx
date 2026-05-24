import { DownloadHistoryItem } from "../types";
import { History, Trash2, Calendar, User, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DownloadHistoryProps {
  history: DownloadHistoryItem[];
  onClear: () => void;
  onSelectUrl: (url: string) => void;
}

export default function DownloadHistory({ history, onClear, onSelectUrl }: DownloadHistoryProps) {
  
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <section id="download-history-block" className="mt-12 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2.5">
          <History className="h-5 w-5 text-indigo-600" />
          <div>
            <h3 className="text-slate-900 font-sans font-bold text-lg">Download History</h3>
            <p className="text-xs text-slate-500">Your recent successful downloads (Saved locally)</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-red-650 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Cache</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center text-center px-4">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/80 mb-3">
            <History className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-slate-600">No download history yet</span>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Your recent successful photo, video, and audio downloads will appear safe and accessible right here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {history.map((item, idx) => (
              <motion.div
                key={item.id + idx}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-200/80 shrink-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-sans font-bold uppercase bg-slate-900/90 text-white max-w-[48px] truncate">
                      {item.type}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-800 truncate pr-4 group-hover:text-slate-900 transition-colors">
                      {item.title}
                    </h4>
                    
                    <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-slate-500 font-medium">
                      <User className="h-3 w-3 shrink-0 text-indigo-600" />
                      <span className="truncate">@{item.username}</span>
                    </div>

                    <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono text-slate-500">
                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[9px] font-bold">
                        {item.format}
                      </span>
                      <span>{item.fileSize}</span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center font-sans font-semibold">
                    <Calendar className="h-3 w-3 text-slate-400 mr-1 shrink-0" />
                    {formatTime(item.timestamp)}
                  </span>

                  <button
                    onClick={() => onSelectUrl(item.url)}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-bold transition-colors duration-200 cursor-pointer"
                  >
                    <span>Load Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
