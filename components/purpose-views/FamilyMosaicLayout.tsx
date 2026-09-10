"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface FamilyMosaicLayoutProps {
  images: any[];
}

const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1581952976147-5a0d15560381?q=80&w=2072&auto=format&fit=crop", // Large horizontal
  "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1954&auto=format&fit=crop", // Small square
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop", // Small square
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070&auto=format&fit=crop", // Tall vertical
  "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=2070&auto=format&fit=crop", // Large horizontal
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop", // Small square
  "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=1926&auto=format&fit=crop", // Tall vertical
  "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=2070&auto=format&fit=crop", // Small square
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 }
  }
};

export default function FamilyMosaicLayout({ images }: FamilyMosaicLayoutProps) {
  // Use uploaded images, fallback to placeholders for exactly 8 slots
  const slots = Array.from({ length: 8 }).map((_, i) => {
    return images[i]?.displayUrl || PLACEHOLDERS[i];
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 bg-[#faf9f6] overflow-hidden py-12">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 grid-rows-[auto] gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[250px]"
      >
        
        {/* 0. Large Horizontal (Col Span 2) */}
        <motion.div variants={itemVariants} className="col-span-2 row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[0]} alt="Mosaic 0" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

        {/* 1. Small Square */}
        <motion.div variants={itemVariants} className="col-span-1 row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[1]} alt="Mosaic 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

        {/* 3. Tall Vertical (Row span 2, pushed to right) */}
        <motion.div variants={itemVariants} className="col-span-1 row-span-2 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[3]} alt="Mosaic 3" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

        {/* 2. Small Square */}
        <motion.div variants={itemVariants} className="col-span-1 row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[2]} alt="Mosaic 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

        {/* 4. Large Horizontal (Col span 2) */}
        <motion.div variants={itemVariants} className="col-span-2 row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[4]} alt="Mosaic 4" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

        {/* 5. Small Square */}
        <motion.div variants={itemVariants} className="col-span-1 row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[5]} alt="Mosaic 5" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

        {/* 6. Tall Vertical */}
        <motion.div variants={itemVariants} className="col-span-1 row-span-2 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[6]} alt="Mosaic 6" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

        {/* 7. Small Square */}
        <motion.div variants={itemVariants} className="col-span-2 row-span-1 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
          <Image src={slots[7]} alt="Mosaic 7" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        </motion.div>

      </motion.div>

    </div>
  );
}
