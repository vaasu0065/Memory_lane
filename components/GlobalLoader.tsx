"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADER_IMAGES = [
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=800", // Travel
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800", // Event/Party
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800", // Friends/Family
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800", // Nature
];

// Duplicate for seamless infinite scrolling
const FILMSTRIP_IMAGES = [...LOADER_IMAGES, ...LOADER_IMAGES];

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#fafafa] flex flex-col items-center justify-center p-4">
      {/* Injecting CSS Keyframes directly so it runs without React hydration */}
      <style>{`
        @keyframes fillBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes scrollFilmstrip {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Container for the loader */}
      <div className="w-full flex flex-col items-center justify-center h-full relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="absolute top-12 left-0 right-0 w-full flex justify-center z-50 pointer-events-none">
          <span 
            className="font-serif italic font-bold text-5xl md:text-7xl text-[#1f2937] drop-shadow-md tracking-tight"
            style={{ animation: "pulseText 3s infinite ease-in-out" }}
          >
            Memory Lane
          </span>
        </div>

        {/* Full-width Cinematic Filmstrip Area */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-36 md:h-56 overflow-hidden bg-black/5 shadow-2xl">
          
          {/* Scrolling Track */}
          <div 
            className="flex h-full w-max"
            style={{ animation: "scrollFilmstrip 20s linear infinite" }}
          >
            {FILMSTRIP_IMAGES.map((src, index) => (
              <div key={index} className="h-full aspect-video p-1 md:p-2">
                <img
                  src={src}
                  alt="Loading memory..."
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </div>
            ))}
          </div>

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
          {/* Edge Fades for smooth entry/exit */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Loading Text and Progress Bar (Positioned below the filmstrip) */}
        <div className="relative z-20 flex flex-col items-center mt-64 md:mt-80">
          <h2 
            className="font-serif italic text-3xl text-[#1f2937] mb-2 tracking-wide"
            style={{ animation: "pulseText 2s infinite ease-in-out" }}
          >
            Gathering Memories...
          </h2>
          <p className="font-handwriting text-gray-500 text-xl mb-8">
            Almost there
          </p>

          {/* Progress Bar */}
          <div className="w-64 md:w-96 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-[#2a2b4b] rounded-full"
              style={{ animation: "fillBar 3s ease-out forwards" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
