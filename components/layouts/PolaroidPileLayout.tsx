"use client";

import { Image as PrismaImage, Note } from "@prisma/client";
import ImageCard from "../ImageCard";
import { motion } from "framer-motion";

interface PolaroidPileLayoutProps {
  images: (PrismaImage & { notes?: Note[] })[];
}

export default function PolaroidPileLayout({ images }: PolaroidPileLayoutProps) {
  return (
    <div className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[80vh] bg-transparent py-24 px-8 md:px-24 flex flex-wrap justify-center items-center content-center album-polaroid-container">
      {images.map((image, i) => {
        // Generate pseudo-random rotations and much larger offsets for a truly "scattered" pile across the screen
        const rotation = (i * 17) % 40 - 20; // -20 to +20 degrees
        
        // Spread them out significantly using margin hacks or just transform
        // We use wide modulo ranges to create messy scatter
        const offsetX = (i * 31) % 160 - 80; 
        const offsetY = (i * 23) % 120 - 60;
        
        return (
          <motion.div
            key={image.id}
            drag
            // Massive drag constraints so they can be tossed anywhere
            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
            whileDrag={{ scale: 1.15, zIndex: 100, cursor: "grabbing" }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            className="w-64 h-72 flex-shrink-0 cursor-grab m-2 md:m-4 album-polaroid-item"
            // Animation: Fall from the top of the screen into their messy pile
            initial={{ opacity: 0, y: -400, rotate: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: offsetX, 
              y: offsetY, 
              rotate: rotation,
              scale: 1
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: i * 0.05 // Staggered falling effect
            }}
            style={{ 
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              borderRadius: "4px" 
            }}
          >
            <ImageCard image={image} index={i} layoutType="polaroid" />
          </motion.div>
        );
      })}
    </div>
  );
}
