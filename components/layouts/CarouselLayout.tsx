"use client";

import { Image as PrismaImage } from "@prisma/client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CarouselLayout({ images, previewMode = false }: { images: PrismaImage[], previewMode?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PrismaImage | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!images || images.length === 0) return null;

  // Calculate carousel geometry (larger and shifted right in preview mode)
  const numItems = images.length;
  const cardWidth = previewMode ? 200 : 250;
  const cardHeight = previewMode ? 280 : 350;
  // A sensible radius so they don't overlap too much. 
  const radius = Math.max(previewMode ? 240 : 300, Math.round((cardWidth / 2) / Math.tan(Math.PI / Math.max(numItems, 3))));

  return (
    <div className={`w-full flex items-center justify-center relative ${
      previewMode ? "h-full bg-transparent overflow-visible translate-x-12" : "h-[80vh] overflow-hidden"
    }`}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .carousel-scene {
          perspective: 1000px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .carousel-spinner {
          width: ${cardWidth}px;
          height: ${cardHeight}px;
          position: relative;
          transform-style: preserve-3d;
          animation: spinCarousel ${numItems * 3}s infinite linear;
        }
        .carousel-spinner.paused {
          animation-play-state: paused;
        }
        @keyframes spinCarousel {
          from { transform: translateZ(-${radius + 100}px) rotateY(0deg); }
          to { transform: translateZ(-${radius + 100}px) rotateY(360deg); }
        }
        .carousel-item {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          backface-visibility: hidden;
          transition: transform 0.3s ease;
        }
        .carousel-item:hover {
          filter: brightness(1.2);
        }
      `}} />

      <div className="carousel-scene">
        <div
          className={`carousel-spinner ${isPaused ? 'paused' : ''}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => !selectedImage && setIsPaused(!isPaused)}
        >
          {images.map((image, index) => {
            const angle = (360 / numItems) * index;
            return (
              <div
                key={image.id}
                className="carousel-item"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-gray-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(image);
                    setIsPaused(true);
                  }}
                >
                  <img
                    src={image.displayUrl}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedImage(null);
              setIsPaused(false);
            }}
          >
            <button 
              className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
                setIsPaused(false);
              }}
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
              src={selectedImage.displayUrl} 
              alt="Expanded Memory"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
