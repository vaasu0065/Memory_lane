"use client";

import { Image as PrismaImage } from "@prisma/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpotlightGallery({ images, previewMode = false }: { images: PrismaImage[], previewMode?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;
  const activeImage = images[activeIndex];

  return (
    <div className={`w-full bg-black rounded-3xl overflow-hidden relative flex flex-col items-center justify-between p-6 ${previewMode ? "h-full" : "h-[85vh]"}`}>
      
      {/* Blurred glowing background matching active image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeImage.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={activeImage.displayUrl} 
            alt="glow" 
            className="w-full h-full object-cover blur-[100px] scale-110 saturate-150"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none"></div>

      {/* Main Spotlight Image */}
      <div className="flex-1 w-full flex items-center justify-center relative z-20 overflow-hidden pt-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            src={activeImage.displayUrl}
            alt="Spotlight"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-black/50"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail Strip */}
      <div className="w-full max-w-5xl overflow-x-auto pb-4 pt-4 z-20 flex gap-4 snap-x snap-mandatory hide-scrollbar">
        {images.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`relative snap-center transition-all duration-300 rounded-xl overflow-hidden ${
                previewMode ? "h-16 min-w-[4rem]" : "h-24 min-w-[6rem] sm:h-32 sm:min-w-[8rem]"
              } ${
                isActive 
                  ? "ring-4 ring-white ring-offset-2 ring-offset-black scale-100 opacity-100" 
                  : "opacity-40 hover:opacity-100 scale-95"
              }`}
            >
              <img 
                src={image.displayUrl} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
      
      {/* Hide Scrollbar CSS trick inline for the thumbnails */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
