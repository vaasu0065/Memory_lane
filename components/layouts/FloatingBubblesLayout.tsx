"use client";

import { Image as PrismaImage } from "@prisma/client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function FloatingBubblesLayout({ images, previewMode = false }: { images: PrismaImage[], previewMode?: boolean }) {
  const [expandedImage, setExpandedImage] = useState<PrismaImage | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bubbles = useMemo(() => {
    return images.map((img, i) => {
      const randSize = previewMode
        ? Math.sin(i * 1.23) * 50 + 90
        : Math.sin(i * 1.23) * 100 + 150;
      const randX = (Math.cos(i * 3.45) * 0.5 + 0.5) * 80;
      const randYOffset = Math.sin(i * 5.67) * 20;
      const duration = Math.cos(i * 7.89) * 10 + 20;
      return {
        ...img,
        size: randSize,
        startX: randX,
        startY: randYOffset,
        duration,
        delay: (i % 5) * -5,
      };
    });
  }, [images, previewMode]);

  if (!images || images.length === 0) return null;

  const containerClass = previewMode
    ? "w-full h-full relative overflow-visible bg-transparent"
    : "w-[100vw] h-[100vh] relative overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-transparent mt-8";

  return (
    <div className={containerClass}>
      
      <div className={`absolute inset-0 pointer-events-none ${previewMode ? "overflow-visible" : "overflow-hidden"}`}>
        {bubbles.map((bubble, i) => (
          <motion.div
            key={bubble.id}
            className="absolute pointer-events-none"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.startX}%`,
            }}
            initial={{ y: "110vh" }}
            animate={{ 
              y: ["110vh", "-50vh"],
              x: [0, Math.sin(i) * 50, -Math.sin(i) * 50, 0] // Drift side to side
            }}
            transition={{
              y: {
                duration: bubble.duration,
                repeat: Infinity,
                ease: "linear",
                delay: bubble.delay,
              },
              x: {
                duration: bubble.duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror"
              }
            }}
          >
            <motion.div
              drag
              dragConstraints={{ top: -500, bottom: 500, left: -500, right: 500 }}
              dragElastic={0.1}
              className="w-full h-full rounded-full overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-4 border-white backdrop-blur-sm pointer-events-auto cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.15, cursor: "grabbing" }}
              onClick={() => setExpandedImage(bubble)}
            >
              <img 
                src={bubble.displayUrl} 
                alt="Memory Bubble"
                className="w-full h-full object-cover pointer-events-none"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-900/80 backdrop-blur-md"
            onClick={() => setExpandedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.5, borderRadius: "50%" }}
              animate={{ scale: 1, borderRadius: "16px" }}
              exit={{ scale: 0.5, borderRadius: "50%", opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="overflow-hidden shadow-2xl bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={expandedImage.displayUrl} 
                alt="Expanded"
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
