"use client";

import { useState, useEffect } from "react";
import { getLayoutComponent } from "@/lib/theme-to-layout";
import { Image as PrismaImage } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

// High-quality sample images for the landing page showcase
const sampleImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto=format&fit=crop",
];

export const mockPrismaImages: (PrismaImage & { notes: any[] })[] = sampleImages.map((url, i) => ({
  id: `mock-${i}`,
  sectionId: "mock-section",
  originalUrl: url,
  displayUrl: url,
  thumbUrl: url,
  width: 800,
  height: 600,
  position: i,
  uploadedAt: new Date(),
  takenAt: new Date(Date.now() - i * 100000000), // Random past dates
  scrapX: null,
  scrapY: null,
  scrapRotate: null,
  notes: [] // Empty notes for the showcase
}));

const SHOWCASE_THEMES = [
  "carousel",
  "cover-flow",
  "tunnel",
  "ribbon",
  "scrapbook",
  "event", // Polaroid Pile
  "travel", // Filmstrip
  "spotlight",
  "bubbles",
  "everyday" // Mosaic
];

export default function Landing3DShowcase() {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % SHOWCASE_THEMES.length);
    }, 6000); // Change theme every 6 seconds
    return () => clearInterval(interval);
  }, []);

  const currentTheme = SHOWCASE_THEMES[themeIndex];
  const Layout = getLayoutComponent(currentTheme);

  return (
    <div className="w-full h-[70vh] md:h-[85vh] relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl my-8 md:my-16 group flex flex-col">
      {/* Top bar indicating current layout */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
        <div className="bg-indigo-900/90 text-white backdrop-blur-md px-6 py-2 rounded-full text-sm font-medium tracking-wider shadow-lg flex gap-2 items-center">
          <span className="opacity-70">Now Showing:</span>
          <span className="capitalize">{currentTheme.replace('-', ' ')} Layout</span>
        </div>
      </div>

      {/* Container for Layout with scale down to simulate full-screen preview */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTheme}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full block"
          >
            <Layout 
              images={mockPrismaImages} 
              albumTitle="Memory Lane Showcase" 
              albumPurpose="discover" 
              previewMode={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
