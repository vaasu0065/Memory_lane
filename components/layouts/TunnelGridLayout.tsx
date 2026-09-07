"use client";

import { useRef, useState, useEffect } from "react";
import { Image as PrismaImage, Note } from "@prisma/client";
import ImageCard from "../ImageCard";
import { motion, useScroll, useTransform } from "framer-motion";

interface TunnelGridLayoutProps {
  images: (PrismaImage & { notes?: Note[] })[];
  previewMode?: boolean;
}

export default function TunnelGridLayout({ images, previewMode = false }: TunnelGridLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the container for normal mode
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Duplicate images to create a massive, virtually infinite tunnel
  const minItems = 150;
  const loopCount = Math.max(1, Math.ceil(minItems / images.length));
  const tunnelImages = Array(loopCount).fill(images).flat();

  const TUNNEL_DEPTH = tunnelImages.length * 800;

  // In preview mode, we auto-animate through the tunnel. In normal mode, we use scroll.
  const autoZ = useRef(0);
  const [previewZ, setPreviewZ] = useState(0);

  useEffect(() => {
    if (!previewMode) return;
    let animationFrameId: number;
    const animate = () => {
      autoZ.current += 2; // Speed of auto-fly
      if (autoZ.current > TUNNEL_DEPTH) autoZ.current = 0; // Loop
      setPreviewZ(autoZ.current);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [previewMode, TUNNEL_DEPTH]);

  const scrollZ = useTransform(scrollYProgress, [0, 1], [0, TUNNEL_DEPTH + 1000]);
  const zTranslation = previewMode ? previewZ : scrollZ;

  const scrollHeight = previewMode ? "100%" : `${tunnelImages.length * 50 + 100}vh`;
  const containerClass = previewMode 
    ? "w-full h-full relative overflow-visible bg-transparent cursor-grab active:cursor-grabbing"
    : "w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] album-tunnel-scroll-container";
    
  const viewportClass = previewMode
    ? "absolute inset-0 w-full h-full flex items-center justify-center bg-transparent"
    : "sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-transparent album-tunnel-viewport";

  return (
    <div
      ref={containerRef}
      style={previewMode ? { height: scrollHeight, clipPath: "polygon(0 0, 200vw 0, 200vw 100%, 0 100%)" } : { height: scrollHeight }}
      className={containerClass}
    >
      <div className={viewportClass}>
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: previewMode ? "800px" : "1500px", transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              z: zTranslation,
              transformStyle: "preserve-3d"
            }}
          >
            {tunnelImages.map((image, i) => {
              const angle = i * 2.4; 
              const radius = previewMode ? 200 + (i % 3) * 100 : 400 + (i % 3) * 200; 

              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              const z = -(i * (previewMode ? 400 : 800)) - 500;

              const rotateY = x > 0 ? -20 : 20;
              const rotateX = y > 0 ? -10 : 10;

              return (
                <div
                  key={`${image.id}-${i}`}
                  className="absolute"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className={`${previewMode ? "w-32 h-40" : "w-72 h-80"} rounded-lg shadow-2xl album-tunnel-item`}>
                    <ImageCard image={image} index={i} layoutType="mosaic" readOnly={previewMode} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
