"use client";

import { Image as PrismaImage } from "@prisma/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function CoverFlowLayout({ images, previewMode = false }: { images: PrismaImage[], previewMode?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(images.length / 2));
  const [expandedImage, setExpandedImage] = useState<PrismaImage | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className={`w-full flex flex-col items-center justify-center overflow-hidden relative perspective-[1200px] ${previewMode ? "h-full" : "h-[70vh]"}`}>
      
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
        <button 
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 disabled:opacity-30 shadow-lg hover:bg-white transition-all"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
        <button 
          onClick={() => setActiveIndex(Math.min(images.length - 1, activeIndex + 1))}
          disabled={activeIndex === images.length - 1}
          className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 disabled:opacity-30 shadow-lg hover:bg-white transition-all"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Cover Flow Container */}
      <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
        {images.map((image, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;
          
          // Calculate 3D transforms
          const zIndex = images.length - absOffset;
          const scale = isCenter ? 1 : Math.max(0.6, 1 - absOffset * 0.15);
          const translateX = offset * 120; // Spread out items horizontally
          const translateZ = isCenter ? 0 : -200 - absOffset * 50; // Push inactive items back
          const rotateY = isCenter ? 0 : offset < 0 ? 45 : -45; // Turn them inwards

          return (
            <motion.div
              key={image.id}
              className="absolute w-64 md:w-80 h-96 cursor-pointer"
              animate={{
                x: translateX,
                z: translateZ,
                rotateY,
                scale,
                zIndex,
                opacity: absOffset > 3 ? 0 : 1, // Hide items too far away
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              onClick={() => {
                if (isCenter) {
                  setExpandedImage(image);
                } else {
                  setActiveIndex(index);
                }
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group">
                <img
                  src={image.displayUrl}
                  alt="Memory"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {!isCenter && <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/20" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setExpandedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              src={expandedImage.displayUrl} 
              alt="Expanded"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
