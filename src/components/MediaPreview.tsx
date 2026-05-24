import { useState, useRef, useEffect } from "react";
import { InstagramMediaDetails, MediaFormat, MediaItem, DownloadHistoryItem } from "../types";
import { 
  Download, Play, Pause, Music, Video as VideoIcon, Image as ImageIcon, 
  Layers, Volume2, VolumeX, Sparkles, Check, ChevronLeft, ChevronRight, 
  Clock, Heart, MessageCircle, Eye, Sliders, Gauge, ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaPreviewProps {
  details: InstagramMediaDetails;
  onDownloadStarted: (item: DownloadHistoryItem) => void;
}

export default function MediaPreview({ details, onDownloadStarted }: MediaPreviewProps) {
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat>("MP4_1080P");
  
  // Media element controllers
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioCutStart, setAudioCutStart] = useState(0);
  const [audioCutEnd, setAudioCutEnd] = useState(15);
  
  // Simulated download triggers
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState("0 MB/s");

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync formats based on incoming type
  useEffect(() => {
    if (details.type === "audio") {
      setSelectedFormat("MP3_320K");
    } else if (details.type === "carousel") {
      setSelectedFormat("IMAGE_HD");
    } else {
      setSelectedFormat("MP4_1080P");
    }
    // reset playback
    setIsPlaying(false);
  }, [details]);

  // Handle Video / Audio previews
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (details.type === "audio") {
      if (audioRef.current) {
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
      }
    } else if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Pre-configured sizes as simulator metrics
  const formatMeta = {
    "MP4_1080P": { label: "1080p Full-HD Video", size: "18.4 MB", type: "video/mp4", ext: "mp4" },
    "MP4_720P": { label: "720p HD Video", size: "9.2 MB", type: "video/mp4", ext: "mp4" },
    "MP3_320K": { label: "320kbps Atmos Audio", size: "5.4 MB", type: "audio/mpeg", ext: "mp3" },
    "MP3_192K": { label: "192kbps MP3 Audio", size: "3.1 MB", type: "audio/mpeg", ext: "mp3" },
    "IMAGE_HD": { label: "HD Original Quality", size: "2.1 MB", type: "image/jpeg", ext: "jpg" }
  };

  // Launch File downloader proxy safely
  const handleDownload = () => {
    const meta = formatMeta[selectedFormat];
    let downloadSourceUrl = "";

    // Extract exact URL alignment
    if (details.type === "carousel" && details.carouselItems) {
      const activeItem = details.carouselItems[activeCarouselIdx];
      downloadSourceUrl = activeItem.url;
    } else if (meta.type.startsWith("audio")) {
      downloadSourceUrl = details.audioExtractUrl || details.mediaItems[0].url;
    } else {
      downloadSourceUrl = details.mediaItems[0].url;
    }

    // Trigger simulation timeline then fire proxy
    let progress = 0;
    setDownloadProgress(0);
    setDownloadSpeed("Calculated...");

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Finalize Download trigger by creating direct proxy anchor download
        const cleanName = `instagram_${details.type}_${details.author.username}_${details.id}.${meta.ext}`;
        const proxyUrl = `/api/proxy/download?url=${encodeURIComponent(downloadSourceUrl)}&filename=${encodeURIComponent(cleanName)}&type=${encodeURIComponent(meta.type)}`;

        // Force native anchor click behavior
        const a = document.createElement("a");
        a.href = proxyUrl;
        a.download = cleanName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          setDownloadProgress(null);
          // Register in localStorage History
          const historyItem: DownloadHistoryItem = {
            id: details.id + "_" + Date.now(),
            timestamp: Date.now(),
            url: details.url,
            title: details.title,
            username: details.author.username,
            avatarUrl: details.author.avatarUrl,
            type: details.type,
            format: selectedFormat,
            fileSize: meta.size,
            thumbnailUrl: details.type === "carousel" && details.carouselItems 
              ? details.carouselItems[activeCarouselIdx].thumbnailUrl 
              : details.mediaItems[0].thumbnailUrl
          };
          onDownloadStarted(historyItem);
        }, 1200);
      } else {
        setDownloadProgress(progress);
        setDownloadSpeed((Math.random() * 8 + 14).toFixed(1) + " MB/s");
      }
    }, 240);
  };

  // Retrieve current active video URL for slide Carousel or direct links
  const activeMediaSource = details.type === "carousel" && details.carouselItems
    ? details.carouselItems[activeCarouselIdx]
    : details.mediaItems[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-100/40 rounded-3xl p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative overflow-hidden text-slate-800"
    >
      
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left Column: Visual Media Preview Player Deck */}
      <div className="lg:col-span-6 flex flex-col justify-between">
        <div className="relative rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80 aspect-[4/5] sm:aspect-square flex items-center justify-center shadow-inner">
          
          <AnimatePresence mode="wait">
            {activeMediaSource.type === "video" || details.type === "reel" ? (
              <video
                key={activeMediaSource.url}
                ref={videoRef}
                src={activeMediaSource.url}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={isMuted}
                referrerPolicy="no-referrer"
              />
            ) : activeMediaSource.type === "audio" ? (
              <div key="audio-cover-deck" className="h-full w-full max-w-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center animate-pulse">
                  <Music className="h-10 w-10 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Instagram Track Preview</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{formatMeta[selectedFormat].label}</p>
                </div>
                <audio ref={audioRef} src={details.audioExtractUrl || activeMediaSource.url} loop muted={isMuted} referrerPolicy="no-referrer" />
              </div>
            ) : (
              <img
                key={activeMediaSource.url}
                src={activeMediaSource.url}
                alt={details.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </AnimatePresence>

          {/* Carousel slide counter elements */}
          {details.type === "carousel" && details.carouselItems && (
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-full border border-slate-800 text-[10px] font-mono font-bold text-white tracking-wider flex items-center space-x-1">
              <Layers className="h-3 w-3 text-indigo-400" />
              <span>{activeCarouselIdx + 1}/{details.carouselItems.length}</span>
            </div>
          )}

          {/* Quick Player overlay triggers */}
          {(activeMediaSource.type === "video" || details.type === "reel" || details.type === "audio") && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2 rounded-xl bg-white/95 backdrop-blur border border-slate-200/80 shadow-md">
              <button
                onClick={togglePlay}
                className="h-9 w-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 active:scale-[0.94] transition-all cursor-pointer shadow-sm"
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-white text-white" /> : <Play className="h-4 w-4 fill-white text-white pl-0.5" />}
              </button>
              
              <span className="text-[10px] font-mono text-slate-500 tracking-wider font-bold">
                {isPlaying ? "LIVE PREVIEW PLAYING" : "PREVIEW PAUSED"}
              </span>

              <button
                onClick={toggleMute}
                className="h-8 w-8 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          )}

          {/* Carousel slide controls */}
          {details.type === "carousel" && details.carouselItems && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                disabled={activeCarouselIdx === 0}
                onClick={() => setActiveCarouselIdx(prev => Math.max(0, prev - 1))}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-800 disabled:opacity-40 pointer-events-auto hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                disabled={activeCarouselIdx === details.carouselItems.length - 1}
                onClick={() => setActiveCarouselIdx(prev => Math.min(details.carouselItems!.length - 1, prev + 1))}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-800 disabled:opacity-40 pointer-events-auto hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Highlight content category */}
        {details.type === "carousel" && (
          <p className="text-[11px] text-slate-500 font-sans mt-3 text-center font-medium">
            💡 Swipe or click arrows to view and download specific high-resolution sliders.
          </p>
        )}
      </div>

      {/* Right Column: Specifications & Operations Panel */}
      <div className="lg:col-span-6 flex flex-col justify-between py-1">
        
        {/* Author / Creator Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden bg-white border-2 border-indigo-100 p-0.5 shadow-sm">
                <img
                  src={details.author.avatarUrl}
                  alt={details.author.username}
                  className="h-full w-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-sans font-bold text-sm text-slate-900">@{details.author.username}</span>
                  {details.author.isVerified && (
                    <span className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-sans font-semibold tracking-wide">{details.author.fullName}</span>
              </div>
            </div>

            {/* Display status Badge */}
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-sans font-bold uppercase text-indigo-600">
              {details.type} Detected
            </span>
          </div>

          {/* Caption */}
          <div className="mt-4">
            <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3 font-medium">
              {details.caption}
            </p>
          </div>

          {/* Video metrics stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/85">
              <span className="block text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider">Likes</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                {details.metrics.likes || "14.2K"}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/85">
              <span className="block text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider">Comments</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
                <MessageCircle className="h-3 w-3 text-indigo-500 fill-indigo-500" />
                {details.metrics.comments || "481"}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/85">
              <span className="block text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider">Views</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
                <Eye className="h-3 w-3 text-indigo-600" />
                {details.metrics.views || "120K"}
              </span>
            </div>
          </div>

          {/* Formats and Quality selections */}
          <div className="mt-6">
            <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400 font-bold block mb-2.5">
              Select Output format & Quality:
            </span>
            <div className="grid grid-cols-2 gap-2">
              
              {/* Show Mp4/Mp3 based on availability */}
              {(details.type === "reel" || details.type === "post" || details.type === "story") && (
                <>
                  <button
                    onClick={() => setSelectedFormat("MP4_1080P")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedFormat === "MP4_1080P" ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm" : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center space-x-2">
                      <VideoIcon className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-xs font-bold">MP4 1080p Ultra</span>
                    </div>
                    <span className="text-[10px] font-sans text-slate-400 block mt-1 font-medium">High HD • ~18.4 MB</span>
                  </button>

                  <button
                    onClick={() => setSelectedFormat("MP4_720P")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedFormat === "MP4_720P" ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm" : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center space-x-2">
                      <VideoIcon className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-bold">MP4 720p HD</span>
                    </div>
                    <span className="text-[10px] font-sans text-slate-400 block mt-1 font-medium">Regular • ~9.2 MB</span>
                  </button>
                </>
              )}

              {/* MP3 support for videos is a primary requirement */}
              {(details.type === "reel" || details.type === "post" || details.type === "audio" || details.type === "story") && (
                <>
                  <button
                    onClick={() => setSelectedFormat("MP3_320K")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedFormat === "MP3_320K" ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm" : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Music className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-xs font-bold">Audio MP3 320K</span>
                    </div>
                    <span className="text-[10px] font-sans text-slate-400 block mt-1 font-medium">Studio Bitrate • ~5.4 MB</span>
                  </button>

                  <button
                    onClick={() => setSelectedFormat("MP3_192K")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedFormat === "MP3_192K" ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm" : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Music className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-bold">Audio MP3 192K</span>
                    </div>
                    <span className="text-[10px] font-sans text-slate-400 block mt-1 font-medium">Mobile Friendly • ~3.1 MB</span>
                  </button>
                </>
              )}

              {/* Carousel photo selections */}
              {details.type === "carousel" && (
                <button
                  onClick={() => setSelectedFormat("IMAGE_HD")}
                  className="col-span-2 p-4 rounded-xl border border-indigo-600 bg-indigo-50/50 text-indigo-950 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4 text-indigo-600" />
                    <div>
                      <span className="text-xs font-bold">HD Original Photo (JPG)</span>
                      <span className="text-[10px] font-sans text-slate-500 block mt-0.5 font-medium">Maximum resolution slide • ~2.1 MB</span>
                    </div>
                  </div>
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Audio Cutter / Trim Board Option (Saves Premium Quality) */}
        {selectedFormat.startsWith("MP3") && (
          <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-sans text-slate-500 flex items-center space-x-1.5 uppercase tracking-wider font-bold">
                <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                <span>Audio Cutter (MP3 Trimmer)</span>
              </span>
              <span className="text-[10px] font-sans text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Range: {audioCutStart}s - {audioCutEnd}s
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="60"
              value={audioCutEnd}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setAudioCutEnd(val);
                if (val <= audioCutStart) {
                  setAudioCutStart(Math.max(0, val - 10));
                }
              }}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
            <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-400 font-medium">
              <span>0s</span>
              <span>15s (Default Loop)</span>
              <span>30s</span>
              <span>60s Full length</span>
            </div>
          </div>
        )}

        {/* Bottom Panel Actions: Speed simulator and triggers */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <AnimatePresence mode="wait">
            {downloadProgress !== null ? (
              <motion.div
                key="download-progress-bar"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-indigo-600 animate-pulse" />
                    <span>Downloading to device...</span>
                  </span>
                  <span className="font-mono text-indigo-600 font-bold">{downloadProgress}%</span>
                </div>
                
                {/* Visual bar container */}
                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Speed: {downloadSpeed}</span>
                  <span>Size: {formatMeta[selectedFormat].size}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="download-trigger-action-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <button
                  onClick={handleDownload}
                  className="p-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center space-x-2.5 font-sans font-bold text-xs transition-all tracking-wide cursor-pointer hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98]"
                >
                  <Download className="h-4 w-4 text-white stroke-[2.5]" />
                  <span>Download Media ({formatMeta[selectedFormat].ext.toUpperCase()})</span>
                </button>

                {/* Sub Action (E.g. Download cover photo only) */}
                <button
                  onClick={() => {
                    const cleanName = `instagram_cover_wallpaper_${details.author.username}_${details.id}.jpg`;
                    const proxyUrl = `/api/proxy/download?url=${encodeURIComponent(details.type === "carousel" && details.carouselItems ? details.carouselItems[activeCarouselIdx].thumbnailUrl : details.mediaItems[0].thumbnailUrl)}&filename=${encodeURIComponent(cleanName)}&type=image/jpeg`;
                    const a = document.createElement("a");
                    a.href = proxyUrl;
                    a.download = cleanName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 flex items-center justify-center space-x-2 font-sans font-bold text-xs transition-all cursor-pointer shadow-sm"
                >
                  <ImageIcon className="h-4 w-4 text-indigo-600" />
                  <span>Save Cover Wallpaper</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
}
