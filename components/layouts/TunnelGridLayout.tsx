"use client";

import { useRef } from "react";
import { Image as PrismaImage, Note } from "@prisma/client";
import ImageCard from "../ImageCard";
import { motion, useScroll, useTransform } from "framer-motion";

interface TunnelGridLayoutProps {
  images: (PrismaImage & { notes?: Note[] })[];
}

export default function TunnelGridLayout({ images }: TunnelGridLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // The total depth of our tunnel based on image count
  // E.g., 20 images * 600px spacing = 12000px deep
  const TUNNEL_DEPTH = images.length * 800;

  // As we scroll, we move the camera forward (positive Z)
  // which is equivalent to moving the world backward (positive Z translation since items start at negative Z)
  const zTranslation = useTransform(scrollYProgress, [0, 1], [0, TUNNEL_DEPTH + 1000]);

  // Height of the scroll container to make the scrolling feel natural
  const scrollHeight = `${images.length * 50 + 100}vh`;

  return (
    <div
      ref={containerRef}
      style={{ height: scrollHeight }}
      className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] album-tunnel-scroll-container"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-transparent album-tunnel-viewport">
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              z: zTranslation,
              transformStyle: "preserve-3d"
            }}
          >
            {images.map((image, i) => {
              // Calculate a pseudo-random X and Y position for the "walls" of the tunnel
              // We want to avoid the exact center (0,0) so the camera doesn't crash through them directly

              // Seeded random based on index
              const angle = i * 2.4; // Golden ratio-ish distribution
              const radius = 400 + (i % 3) * 200; // Distance from center tube

              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              // Place them deep into the screen
              const z = -(i * 800) - 500;

              // Slight rotation to face inward towards the center of the tunnel
              const rotateY = x > 0 ? -20 : 20;
              const rotateX = y > 0 ? -10 : 10;

              return (
                <div
                  key={image.id}
                  className="absolute"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* We apply motion to opacity so they fade in/out smoothly based on scroll */}
                  <div className="w-72 h-80 rounded-lg shadow-2xl album-tunnel-item">
                    <ImageCard image={image} index={i} layoutType="mosaic" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Helper overlay text instructing to scroll */}
        {/* <div className="absolute bottom-10 text-ink/40 font-bold uppercase tracking-widest text-sm pointer-events-none animate-pulse">
          Scroll to fly through
        </div> */}
      </div>
    </div>
  );
}
