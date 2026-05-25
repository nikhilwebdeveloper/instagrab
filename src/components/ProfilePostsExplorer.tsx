import React, { useState } from "react";
import { Search, Heart, MessageCircle, Eye, Film, Image as ImageIcon, Layers, Sparkles, Loader2, AlertCircle, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { InstagramMediaDetails } from "../types";

interface ProfilePostsExplorerProps {
  onSelectPost: (post: InstagramMediaDetails) => void;
}

export default function ProfilePostsExplorer({ onSelectPost }: ProfilePostsExplorerProps) {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedUser, setSearchedUser] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().replace(/^@/, "");
    if (!cleanUser) return;

    setLoading(true);
    setError(null);
    setPosts([]);

    try {
      const res = await fetch("/api/instagram/profile-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUser })
      });

      if (!res.ok) {
        throw new Error("Unable to contact backend profile server. Please retry.");
      }

      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setSearchedUser(data.username);
        setIsDemoMode(!!data.usingFallback);
      } else {
        throw new Error(data.error || "Failed to retrieve profile feed.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected network issue occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "carousel":
        return <Layers className="h-4 w-4 text-white" />;
      case "reel":
        return <Film className="h-4 w-4 text-white" />;
      default:
        return <ImageIcon className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 relative overflow-hidden">
      {/* Absolute visual glows */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header info */}
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        <h1 className="text-2xl sm:text-4xl font-sans font-extrabold text-slate-900 tracking-tight leading-tight">
          Profile Feed Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-sans font-medium">
          Enter any public Instagram handle to explore posts & convert media instantly
        </p>
      </div>

      {/* Username query input box */}
      <form onSubmit={handleSearch} className="relative z-10 space-y-4">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none text-sm font-sans font-medium">@</div>
          <input
            type="text"
            placeholder="instagram_username (e.g. keke, selenagomez)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full p-4 pl-9 pr-24 sm:pr-32 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 disabled:opacity-75 transition-all duration-300 font-sans"
          />

          <div className="absolute right-2">
            {username && (
              <button
                type="button"
                onClick={() => setUsername("")}
                className="text-xs bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2.5 text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full relative group p-4 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-95 text-white font-sans font-bold text-sm tracking-wide shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Fetching profile posts...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4 text-white stroke-[2.5]" />
              <span>Search Profile Feed</span>
            </>
          )}
        </button>
      </form>

      {/* Demo helper flag */}
      {isDemoMode && searchedUser && (
        <div className="mt-4 relative z-10 flex items-start space-x-2 bg-amber-50/50 border border-amber-200/60 p-3.5 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-sans font-medium">
          <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Live AI Demo Mode active:</span> Generated beautiful, realistic preview posts for <span className="font-bold">@{searchedUser}</span> matching their profile theme. Add your <span className="font-bold">RAPIDAPI_KEY</span> in the AI Studio Settings panel anytime to fetch live feeds! All mock files are fully interactive and downloadable.
          </div>
        </div>
      )}

      {/* Post cards feed results */}
      {posts.length > 0 && searchedUser && (
        <div className="mt-8 relative z-10 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Recent posts from @{searchedUser} (Select to load downloads):
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-sans px-2 py-0.5 rounded-full font-semibold">
              {posts.length} Posts Found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => {
              const mainMedia = post.mediaItems?.[0];
              const coverType = mainMedia?.type || 'image';
              const cover = post.carouselItems?.[0]?.thumbnailUrl || mainMedia?.thumbnailUrl;

              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="group relative flex flex-col bg-slate-50 border border-slate-200/80 hover:border-indigo-400/50 rounded-2xl p-3 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 overflow-hidden"
                >
                  {/* Thumbnail / Image preview block */}
                  <div className="w-full h-40 bg-slate-100 rounded-xl relative overflow-hidden mb-3 select-none">
                    <img
                      src={cover}
                      alt="Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Media Type Overlay Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-lg">
                      {getMediaIcon(post.type)}
                    </div>

                    {/* Quick Select overlay */}
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Select Media
                      </span>
                    </div>
                  </div>

                  {/* Caption snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 min-h-[2.25rem] leading-relaxed font-sans font-medium px-0.5">
                    {post.caption}
                  </p>

                  {/* Action stats row */}
                  <div className="flex items-center space-x-4 pt-2.5 mt-auto border-t border-slate-200/50 text-[10px] text-slate-400 font-sans font-bold px-0.5">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
                      <span>{post.metrics?.likes || "0"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                      <span>{post.metrics?.comments || "0"}</span>
                    </div>
                    {post.metrics?.views && (
                      <div className="flex items-center space-x-1 ml-auto">
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        <span>{post.metrics?.views}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
