import { useState } from "react";
import { HelpCircle, ChevronDown, CheckCircle2, Video, Music, Image, Layers, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FeaturesFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How to download Instagram Reels, Posts, and Stories?",
      answer: "Simply copy the link of any Reel or post from Instagram, paste it in the input area above, and click 'Analyze Link'. You'll instantly receive download options for high-quality video, audio, and thumbnail image files."
    },
    {
      question: "Can I extract and download audio as MP3?",
      answer: "Yes, absolutely! If you paste a Reel or video link, our advanced engine automatically extracts the clean high-quality background audio. You can then download it as high-bitrate MP3 (up to 320kbps) with one click."
    },
    {
      question: "How to save Slide/Carousel (multiple photos and videos) posts?",
      answer: "When you analyze a Carousel link, each slide is parsed separately. You can preview and separately download each individual image or video in its native high definition."
    },
    {
      question: "Does it support private accounts?",
      answer: "Due to safety parameters, only media from public Instagram accounts can be fetched and downloaded. Private content is not accessible to keep user data secure."
    },
    {
      question: "Is there any limit to the number of downloads?",
      answer: "No! Feel free to download as many videos, audio tracks, and photos as you like. Our service is completely free, unlimited, and requires no account registration or installation."
    }
  ];

  const features = [
    {
      icon: <Video className="h-5 w-5 text-indigo-600" />,
      title: "Super HD MP4 Quality",
      desc: "Download pristine 1080p or 720p videos without quality compression."
    },
    {
      icon: <Music className="h-5 w-5 text-indigo-600" />,
      title: "Audio Extraction",
      desc: "Turn any Reel or video background into an elegant 320kbps MP3 audio file."
    },
    {
      icon: <Image className="h-5 w-5 text-indigo-600" />,
      title: "Full-Res Image/Thumbnail",
      desc: "Save high-definition cover images and dynamic sliders instantly."
    },
    {
      icon: <Layers className="h-5 w-5 text-indigo-600" />,
      title: "Unlocks Stories & Audios",
      desc: "Easily backup public story slides and trending music streams."
    }
  ];

  return (
    <section id="faq-features-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
      
      {/* Visual Benefits */}
      <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => (
          <div 
            key={idx} 
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all duration-300 flex flex-col space-y-3 shadow-sm hover:shadow"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200/60 shadow-inner">
              {feat.icon}
            </div>
            <div>
              <h3 className="text-slate-800 font-sans font-bold text-sm">{feat.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Block & FAQs */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-sans font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Premium Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            Save Instagram media at lightning speed
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            The premier ad-free, secure, and clean Instagram media download tool. Download Reels, Carousel slides, Photos, Stories, and MP3 audio tracks instantly for free with zero watermarks.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start space-x-3 text-sm text-slate-700 font-medium">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Guaranteed Safe & Anonymous (No Login required)</span>
            </div>
            <div className="flex items-start space-x-3 text-sm text-slate-700 font-medium">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Watermark-free High Quality MP4 downloads</span>
            </div>
            <div className="flex items-start space-x-3 text-sm text-slate-700 font-medium">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Fast background MP3 Audio conversion</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-sans font-bold text-xs shadow-inner">
            100%
          </div>
          <div>
            <span className="text-xs text-slate-800 font-bold block">Free & Unlimited</span>
            <span className="text-[10px] text-slate-400 font-mono">Ads Free & Minimalist</span>
          </div>
        </div>
      </div>

      {/* FAQs Collapsible list */}
      <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center space-x-2.5 mb-6">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          <h3 className="text-slate-900 font-sans font-bold text-lg">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border-b border-slate-100 pb-3"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-2 text-slate-800 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-sm font-bold pr-4 font-sans leading-relaxed">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-450 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed pb-2 font-sans pl-1">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
