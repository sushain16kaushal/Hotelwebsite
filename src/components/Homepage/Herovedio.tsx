import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Reeldata } from "../../types/content";

const ReelCard = ({ reel }: { reel: Reeldata }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Video Play Logic
  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch((err) => console.log("Playback error:", err));
  };

  // Video Pause & Reset Logic
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Wapas shuruat par le aayega
    }
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Mobile par tap karne se play/pause toggle hoga
      onClick={() => {
        if (videoRef.current?.paused) handleMouseEnter();
        else handleMouseLeave();
      }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="relative group aspect-[9/16] w-full overflow-hidden rounded-[3rem] bg-stone-100 shadow-2xl border border-stone-200/50 cursor-pointer"
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster={reel.posterUrl}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        preload="metadata" // Performance: Load only when needed
      >
        <source src={reel.videoUrl} type="video/webm" />
        <source src={reel.videoUrl.replace('f-webm', 'f-mp4')} type="video/mp4" />
      </video>

      {/* Luxury Overlay Gradient */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'bg-black/20' : 'bg-black/40'} flex flex-col justify-end p-8`}>
        <span className="text-[10px] uppercase tracking-[3px] text-amber-300 font-bold mb-2">
          {reel.tag}
        </span>
        <h3 className="text-2xl font-serif font-bold text-white leading-tight mb-4">
          {reel.title}
        </h3>

        {/* Watch Indicator - Only visible when NOT hovering */}
        {!isHovered && (
          <div className="flex items-center gap-2 transition-all duration-500">
            <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
            </div>
            <span className="text-[9px] text-white uppercase tracking-widest font-bold">Preview</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function Herovedio({ reeldata }: { reeldata: Reeldata[] }) {
  return (
    <section className="py-24 bg-[#fdfaf5] px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {reeldata.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
}