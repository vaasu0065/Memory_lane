"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Image as PrismaImage } from "@prisma/client";

interface LightboxProps {
  images: PrismaImage[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);

  if (currentIndex === null) return null;

  const currentImage = images[currentIndex];

  // Hydration-safe date formatter
  const formatDate = (dateString: Date | string) => {
    const d = new Date(dateString);
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors z-50"
        >
          <X size={28} />
        </button>

        {/* Prev Button */}
        {currentIndex > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
            className="absolute left-6 text-white/70 hover:text-white p-4 bg-black/20 hover:bg-black/40 rounded-full transition-colors z-50"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < images.length - 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
            className="absolute right-6 text-white/70 hover:text-white p-4 bg-black/20 hover:bg-black/40 rounded-full transition-colors z-50"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Main Image Container */}
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={currentImage.displayUrl} 
            alt="Full size view" 
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-md shadow-2xl"
          />
          {currentImage.takenAt && (
            <div className="absolute -bottom-8 text-white/80 font-serif text-sm">
              {formatDate(currentImage.takenAt)}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
