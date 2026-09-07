"use client";

import { Image as PrismaImage } from "@prisma/client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Star, Heart, Music } from "lucide-react";

// Masking tape strip – semi-transparent sandy colour
const MaskingTape = ({ rotate = 0 }: { rotate?: number }) => (
  <div
    className="absolute z-20 pointer-events-none"
    style={{
      width: 56,
      height: 18,
      background: "rgba(216,198,160,0.82)",
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    }}
  />
);

// A single dark-bronze binder ring
const BinderRing = () => (
  <div className="relative flex items-center justify-center" style={{ width: 28, height: 28 }}>
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: "radial-gradient(circle at 35% 35%, #7a6a55, #2a1f14)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.15)",
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        width: 14,
        height: 14,
        background: "radial-gradient(circle at 40% 40%, #5a4a38, #1a100a)",
        boxShadow: "inset 0 3px 6px rgba(0,0,0,0.8)",
      }}
    />
  </div>
);

export default function ScrapbookLayout({
  images,
  stickyNotes = [],
  albumTitle = "My Scrapbook",
  albumPurpose = "memories",
  previewMode = false,
}: {
  images: any[];
  stickyNotes?: any[];
  albumTitle?: string;
  albumPurpose?: string;
  previewMode?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedImage, setExpandedImage] = useState<PrismaImage | null>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  if (!images || images.length === 0) return null;

  const IMAGES_PER_PAGE = 2;
  const IMAGES_PER_SPREAD = IMAGES_PER_PAGE * 2;
  const totalSpreads = Math.ceil(images.length / IMAGES_PER_SPREAD);
  const currentPageStickies = stickyNotes.filter((s) => s.page === currentPage);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (wheelTimeout.current) return;
    if (e.deltaY > 30 && currentPage < totalSpreads) {
      setCurrentPage((p) => Math.min(totalSpreads, p + 1));
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 800);
    } else if (e.deltaY < -30 && currentPage > 0) {
      setCurrentPage((p) => Math.max(0, p - 1));
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 800);
    }
  };

  // ── Page content renderer ──────────────────────────────────────────────────
  const renderPageContent = (pageImages: any[], isLeft: boolean) => {
    if (pageImages.length === 0)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-400 font-serif italic text-lg">The End</p>
        </div>
      );

    // 2 photos per page — staggered positions matching the reference image
    const slotPositions = isLeft
      ? [
          { top: "8%",  left: "8%",  rotate: -4, tapeRotate: -5 },   // top-left
          { top: "48%", left: "22%", rotate: 3,  tapeRotate: 4  },   // bottom-center-left
        ]
      : [
          { top: "6%",  left: "28%", rotate: 3,  tapeRotate: 4  },   // top-right
          { top: "46%", left: "10%", rotate: -3, tapeRotate: -4 },   // bottom-left
        ];

    return (
      <div className="w-full h-full relative overflow-visible">
        {/* Handwritten page label – positioned away from photos */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            top: "4%",
            left: isLeft ? "52%" : "2%",
            rotate: isLeft ? "-5deg" : "6deg",
            maxWidth: "40%",
          }}
        >
          <p className="font-handwriting text-[clamp(0.8rem,1.5vw,1.3rem)] leading-snug text-gray-600/85 whitespace-pre-line">
            {isLeft ? "Family\nMoments \u2661" : "Collecting\ngood moments\n\u2661"}
          </p>
        </div>

        {/* Photos */}
        {pageImages.map((image, idx) => {
          const slot = slotPositions[idx] || slotPositions[0];
          const noteText = image.notes?.[0]?.text;
          const noteFont = image.notes?.[0]?.fontFamily || "'Caveat', cursive";

          return (
            <div
              key={image.id}
              className="absolute cursor-pointer"
              style={{
                top: slot.top,
                left: slot.left,
                width: "44%",
                rotate: `${slot.rotate}deg`,
                zIndex: 20,
              }}
              onClick={() => setExpandedImage(image)}
            >
              {/* Tape centered at top */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: -8, zIndex: 21, position: "relative" }}>
                <MaskingTape rotate={slot.tapeRotate} />
              </div>

              {/* Polaroid */}
              <div
                style={{
                  background: "#fefefe",
                  padding: "8px 8px 0 8px",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.25), 0 3px 8px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.displayUrl}
                    alt="Scrapbook Memory"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
                {/* Caption on the white polaroid border */}
                <div style={{ minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", padding: "5px 4px 6px" }}>
                  <p
                    style={{
                      fontFamily: noteFont,
                      fontSize: "clamp(11px, 1.2vw, 16px)",
                      color: "#2a2a2a",
                      lineHeight: 1.2,
                      textAlign: "center",
                    }}
                  >
                    {noteText || ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Sticky notes on this page half */}
        {currentPageStickies.map((note) => {
          const isOnLeft = (note.x || 0) < 50;
          if ((isLeft && !isOnLeft) || (!isLeft && isOnLeft)) return null;
          // re-map x from 0-50 or 50-100 into 0-85% of the half-page
          const localX = isLeft
            ? Math.min((note.x || 10), 45) * 1.7
            : Math.max(((note.x || 55) - 50), 2) * 1.7;
          return (
            <div
              key={note.id}
              className="absolute pointer-events-none"
              style={{
                left: `${localX}%`,
                top: `${note.y || 30}%`,
                width: 150,
                rotate: `${note.rotation || (isLeft ? -4 : 5)}deg`,
                zIndex: 50,
                background: note.color || "#fef08a",
                padding: 10,
                boxShadow: "3px 4px 12px rgba(0,0,0,0.18)",
              }}
            >
              {/* Tape on sticky */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: -18, marginBottom: 4 }}>
                <MaskingTape rotate={-3} />
              </div>
              <p
                className="font-handwriting text-lg leading-relaxed whitespace-pre-wrap"
                style={{ color: "#1a1a1a" }}
              >
                {note.content}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Page assignment ────────────────────────────────────────────────────────
  let leftContent: React.ReactNode;
  let rightContent: React.ReactNode;

  if (currentPage === 0) {
    // Cover
    leftContent = (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1e1a17] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }}
        />
      </div>
    );
    rightContent = (
      <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center">
        <h1 className="font-serif italic text-4xl md:text-5xl text-gray-700 mb-6 leading-tight">{albumTitle}</h1>
        <div className="w-16 h-[2px] bg-gray-400/60 mb-6 rounded-full" />
        <p className="uppercase tracking-[0.3em] text-gray-500 text-sm font-semibold">{albumPurpose}</p>
      </div>
    );
  } else {
    const startIndex = (currentPage - 1) * IMAGES_PER_SPREAD;
    leftContent = renderPageContent(images.slice(startIndex, startIndex + IMAGES_PER_PAGE), true);
    rightContent = renderPageContent(images.slice(startIndex + IMAGES_PER_PAGE, startIndex + IMAGES_PER_SPREAD), false);
  }

  // ── Layout modes ───────────────────────────────────────────────────────────
  // previewMode = dashboard card  (no outer wrapper background, fills container)
  // normal mode = full-width scrapbook page in editor

  if (previewMode) {
    return (
      <div className="w-full h-full relative" onWheel={handleWheel}>
        {/* THE BOOK — fills the entire container */}
        <div
          className="absolute inset-0 flex"
          style={{
            background: "#bbbcbd",
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")',
            borderRadius: 20,
            boxShadow: "0 40px 80px rgba(0,0,0,0.35), 0 10px 30px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Left page */}
          <div
            className="flex-1 h-full relative z-10"
            style={{
              background: "#dddbd7",
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
              boxShadow: "inset -20px 0 40px rgba(0,0,0,0.12)",
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`lp-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {leftContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Binder rings spine */}
          <div
            className="absolute top-0 bottom-0 z-40 flex flex-col justify-evenly items-center pointer-events-none"
            style={{ left: "50%", transform: "translateX(-50%)", width: 36, padding: "24px 0" }}
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <BinderRing key={i} />
            ))}
          </div>

          {/* Center shadow line */}
          <div
            className="absolute top-0 bottom-0 z-30 pointer-events-none"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              background: "linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.25), rgba(0,0,0,0.15))",
              filter: "blur(2px)",
            }}
          />

          {/* Right page */}
          <div
            className="flex-1 h-full relative z-10"
            style={{
              background: "#dddbd7",
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
              boxShadow: "inset 20px 0 40px rgba(0,0,0,0.12)",
              borderLeft: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`rp-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                {rightContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation – sits in the gap below the book */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 z-50" style={{ bottom: -44 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-500 font-medium tracking-wide">
            {currentPage === 0 ? "Cover" : `Spread ${currentPage} of ${totalSpreads}`}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalSpreads, p + 1))}
            disabled={currentPage === totalSpreads}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── EDITOR / FULL MODE ─────────────────────────────────────────────────────
  return (
    <div
      className="w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative flex flex-col items-center justify-center py-12 px-4 md:px-16 mt-8"
      style={{
        background: "#d4cbb8",
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/sandpaper.png")',
      }}
      onWheel={handleWheel}
    >
      {/* Nav top */}
      <div className="flex items-center gap-6 mb-8 z-10">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="w-12 h-12 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft />
        </button>
        <span className="font-sans text-gray-700 font-medium tracking-wide text-base">
          {currentPage === 0 ? "Cover" : `Spread ${currentPage} of ${totalSpreads}`}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalSpreads, p + 1))}
          disabled={currentPage === totalSpreads}
          className="w-12 h-12 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Book */}
      <div
        className="w-full max-w-6xl flex"
        style={{
          aspectRatio: "16/10",
          background: "#bbbcbd",
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")',
          borderRadius: 24,
          boxShadow: "0 50px 100px rgba(0,0,0,0.45), 0 16px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Left page */}
        <div
          className="flex-1 h-full relative z-10"
          style={{
            background: "#dddbd7",
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
            boxShadow: "inset -24px 0 48px rgba(0,0,0,0.14)",
            borderRight: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`lf-${currentPage}`}
              initial={{ opacity: 0, rotateY: 60, originX: 1 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 60 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {leftContent}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Spine rings */}
        <div
          className="absolute top-0 bottom-0 z-40 flex flex-col justify-evenly items-center pointer-events-none"
          style={{ left: "50%", transform: "translateX(-50%)", width: 40, padding: "32px 0" }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <BinderRing key={i} />
          ))}
        </div>

        {/* Center crease */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            background: "linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0.28), rgba(0,0,0,0.18))",
            filter: "blur(3px)",
          }}
        />

        {/* Right page */}
        <div
          className="flex-1 h-full relative z-10"
          style={{
            background: "#dddbd7",
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
            boxShadow: "inset 24px 0 48px rgba(0,0,0,0.14)",
            borderLeft: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`rf-${currentPage}`}
              initial={{ opacity: 0, rotateY: -60, originX: 0 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -60 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {rightContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  /* ── Image expand modal (shared) ───────────────────────────────────────── */
  return (
    <AnimatePresence>
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setExpandedImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="p-4 bg-white pb-16 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage.displayUrl}
              alt="Expanded"
              className="max-w-full max-h-[85vh] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
