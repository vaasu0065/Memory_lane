"use client";

import { useState } from "react";
import { Image as PrismaImage, Note } from "@prisma/client";
import { motion } from "framer-motion";
import ImageCard from "../ImageCard";
import Lightbox from "../Lightbox";

interface FilmstripLayoutProps {
  images: (PrismaImage & { notes?: Note[] })[];
}

export default function FilmstripLayout({ images }: FilmstripLayoutProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  // Duplicate images multiple times to ensure the marquee never runs out of content on large screens
  const marqueeImages = [...images, ...images, ...images, ...images];
  
  const CARD_WIDTH = 300;
  // gap-8 is 32px
  const GAP = 32;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-${(CARD_WIDTH + GAP) * images.length}px); }
        }
        .marquee-track {
          animation: slide-marquee ${images.length * 4}s linear infinite;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
      `}} />
      
      {/* Bleed out of the parent container to span the entire 100vw window width */}
      <div className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-8 overflow-hidden bg-transparent marquee-container">
        <div className="w-full overflow-hidden flex">
          <div className="flex gap-8 py-8 px-4 marquee-track">
            {marqueeImages.map((image, i) => (
              <div 
                key={`${image.id}-${i}`} 
                className="flex-shrink-0 relative"
                style={{ width: CARD_WIDTH, height: 350 }}
              >
                <ImageCard 
                  image={image} 
                  index={i} 
                  layoutType="slider" 
                  onClick={() => setLightboxIndex(i % images.length)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Lightbox 
        images={images} 
        currentIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onNavigate={setLightboxIndex} 
      />
    </>
  );
}
