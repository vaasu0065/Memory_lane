"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, Bold, Italic, Underline, 
  StickyNote as StickyNoteIcon, Type, Palette, Trash2, 
  GripVertical, Save, Loader2, Pencil
} from "lucide-react";
import { addNoteAction } from "@/app/actions/addNote";
import { 
  updateNoteAction, addStickyNoteAction, updateStickyNoteAction,
  deleteStickyNoteAction, updateImageScrapPositionAction
} from "@/app/actions/scrapbookActions";

// Define types inline to avoid stale Prisma client cache
type NoteType = {
  id: string;
  imageId: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
};

type StickyNote = {
  id: string;
  sectionId: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  page: number;
  createdAt: Date;
};

type ImageWithNotes = {
  id: string;
  sectionId: string;
  originalUrl: string;
  displayUrl: string;
  thumbUrl: string;
  takenAt: Date | null;
  uploadedAt: Date;
  width: number;
  height: number;
  position: number;
  scrapX: number | null;
  scrapY: number | null;
  scrapRotate: number | null;
  notes: NoteType[];
};

const FONTS = [
  { value: "serif", label: "Serif" },
  { value: "'Caveat', cursive", label: "Handwriting" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "sans-serif", label: "Sans-serif" },
  { value: "monospace", label: "Monospace" },
];

const STICKY_COLORS = [
  "#fef08a", // yellow
  "#fca5a5", // red
  "#86efac", // green
  "#93c5fd", // blue
  "#c4b5fd", // purple
  "#fdba74", // orange
];

const IMAGES_PER_PAGE = 2;
const IMAGES_PER_SPREAD = IMAGES_PER_PAGE * 2;

// ---- Formatting Toolbar ----
function FormattingToolbar({
  formatting,
  onChange,
  onAddSticky,
  isSaving,
}: {
  formatting: { fontFamily: string; fontSize: number; color: string; isBold: boolean; isItalic: boolean; isUnderline: boolean };
  onChange: (key: string, value: any) => void;
  onAddSticky: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md mb-6">
      {/* Font Selector */}
      <div className="flex items-center gap-1.5">
        <Type size={16} className="text-gray-500" />
        <select
          value={formatting.fontFamily}
          onChange={(e) => onChange("fontFamily", e.target.value)}
          className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          {FONTS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Font Size */}
      <select
        value={formatting.fontSize}
        onChange={(e) => onChange("fontSize", parseInt(e.target.value))}
        className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(s => (
          <option key={s} value={s}>{s}px</option>
        ))}
      </select>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Bold */}
      <button
        onClick={() => onChange("isBold", !formatting.isBold)}
        className={`p-2 rounded-lg transition-colors ${formatting.isBold ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>

      {/* Italic */}
      <button
        onClick={() => onChange("isItalic", !formatting.isItalic)}
        className={`p-2 rounded-lg transition-colors ${formatting.isItalic ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>

      {/* Underline */}
      <button
        onClick={() => onChange("isUnderline", !formatting.isUnderline)}
        className={`p-2 rounded-lg transition-colors ${formatting.isUnderline ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        title="Underline"
      >
        <Underline size={16} />
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Color Picker */}
      <div className="flex items-center gap-1.5">
        <Palette size={16} className="text-gray-500" />
        <input
          type="color"
          value={formatting.color}
          onChange={(e) => onChange("color", e.target.value)}
          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
          title="Text Color"
        />
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Add Sticky Note */}
      <button
        onClick={onAddSticky}
        className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        title="Add Sticky Note"
      >
        <StickyNoteIcon size={16} />
        Add Sticky
      </button>

      {/* Saving indicator */}
      {isSaving && (
        <div className="flex items-center gap-1.5 text-gray-400 text-xs ml-auto">
          <Loader2 size={14} className="animate-spin" />
          Saving...
        </div>
      )}
    </div>
  );
}

// ---- Editable Sticky Note ----
function EditableStickyNote({ 
  sticky, 
  formatting,
  onDelete 
}: { 
  sticky: StickyNote;
  formatting: { fontFamily: string; fontSize: number; color: string; isBold: boolean; isItalic: boolean; isUnderline: boolean };
  onDelete: (id: string) => void;
}) {
  const [text, setText] = useState(sticky.text);
  const [isSaving, setIsSaving] = useState(false);
  const [pos, setPos] = useState({ x: sticky.x, y: sticky.y });
  const [isDragging, setIsDragging] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateStickyNoteAction(sticky.id, { text: newText, ...formatting, color: sticky.color });
      } catch (e) { console.error(e); }
      setIsSaving(false);
    }, 800);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on textarea or button
    if ((e.target as HTMLElement).tagName === "TEXTAREA" || (e.target as HTMLElement).tagName === "BUTTON") return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, startX: pos.x, startY: pos.y };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragStartRef.current || !stickyRef.current) return;
      const parent = stickyRef.current.closest(".scrapbook-book") as HTMLElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();

      const deltaXPercent = ((ev.clientX - dragStartRef.current.mouseX) / rect.width) * 100;
      const deltaYPercent = ((ev.clientY - dragStartRef.current.mouseY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(85, dragStartRef.current.startX + deltaXPercent));
      const newY = Math.max(0, Math.min(85, dragStartRef.current.startY + deltaYPercent));
      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = async () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setIsDragging(false);
      // Save final position
      try {
        await updateStickyNoteAction(sticky.id, { x: pos.x, y: pos.y });
      } catch (e) { console.error(e); }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={stickyRef}
      onMouseDown={handleMouseDown}
      className={`absolute z-30 group ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transition: isDragging ? "none" : "left 0.1s, top 0.1s",
      }}
    >
      <div 
        className="w-36 sm:w-44 min-h-[100px] p-3 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] relative select-none"
        style={{ backgroundColor: sticky.color }}
      >
        {/* Fold effect */}
        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-black/10 to-transparent" />
        
        {/* Delete button */}
        <button
          onClick={() => onDelete(sticky.id)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <X size={12} />
        </button>

        {/* Drag handle */}
        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-50 transition-opacity text-gray-600">
          <GripVertical size={14} />
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            handleTextChange(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onFocus={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          className="w-full bg-transparent border-none outline-none resize-vertical leading-relaxed overflow-hidden min-h-[80px]"
          style={{
            fontFamily: formatting.fontFamily,
            fontSize: `${formatting.fontSize}px`,
            color: "#1a1a1a",
            fontWeight: formatting.isBold ? "bold" : "normal",
            fontStyle: formatting.isItalic ? "italic" : "normal",
            textDecoration: formatting.isUnderline ? "underline" : "none",
          }}
        />
        
        {isSaving && (
          <div className="absolute bottom-1 right-1">
            <Loader2 size={10} className="animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Inline Editable Note (next to images) ----
function InlineEditableNote({
  image,
  formatting,
}: {
  image: ImageWithNotes;
  formatting: { fontFamily: string; fontSize: number; color: string; isBold: boolean; isItalic: boolean; isUnderline: boolean };
}) {
  const existingNote = image.notes?.[0];
  const [text, setText] = useState(existingNote?.text || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = useCallback(async (newText: string) => {
    setIsSaving(true);
    try {
      if (existingNote) {
        await updateNoteAction(existingNote.id, { text: newText, ...formatting });
      } else if (newText.trim()) {
        await addNoteAction(image.id, newText.trim(), formatting);
      }
    } catch (e) { console.error(e); }
    setIsSaving(false);
  }, [existingNote, image.id, formatting]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => handleSave(newText), 1000);
  };

  if (!isEditing && !text) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-gray-500 transition-colors text-xs font-serif italic"
      >
        <Pencil size={12} />
        Add a note...
      </button>
    );
  }

  if (isEditing || text) {
    return (
      <div className="relative w-full">
        <textarea
          value={text}
          onChange={(e) => {
            handleTextChange(e.target.value);
            // Auto-expand textarea
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onFocus={(e) => {
            setIsEditing(true);
            // Set initial height
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onBlur={() => { if (!text.trim()) setIsEditing(false); }}
          placeholder="Write your note here..."
          rows={1}
          className="w-full bg-transparent border-none outline-none resize-vertical leading-relaxed placeholder:text-gray-300 overflow-hidden min-h-[40px]"
          style={{
            fontFamily: formatting.fontFamily,
            fontSize: `${formatting.fontSize}px`,
            color: formatting.color,
            fontWeight: formatting.isBold ? "bold" : "normal",
            fontStyle: formatting.isItalic ? "italic" : "normal",
            textDecoration: formatting.isUnderline ? "underline" : "none",
          }}
        />
        {isSaving && (
          <Loader2 size={10} className="animate-spin text-gray-400 absolute bottom-0 right-0" />
        )}
      </div>
    );
  }

  return null;
}

// ---- Paperclip SVG ----
const PaperClip = ({ className }: { className?: string }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

// ---- Binder Ring ----
const BinderRing = () => (
  <div className="flex items-center justify-center w-full h-10 mb-4 relative z-50">
    <div className="absolute left-[-2px] w-4 h-4 bg-[#222] rounded-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.9)] -translate-x-1/2" />
    <div className="absolute right-[-2px] w-4 h-4 bg-[#222] rounded-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.9)] translate-x-1/2" />
    <div className="absolute w-[calc(100%+16px)] h-8 border-[5px] border-t-[#f1f5f9] border-b-[#64748b] border-l-[#94a3b8] border-r-[#94a3b8] rounded-[50%] shadow-[0_5px_10px_rgba(0,0,0,0.4)]" />
  </div>
);

// ==== MAIN EDITOR COMPONENT ====
export default function ScrapbookEditor({
  images,
  stickyNotes: initialStickyNotes,
  sectionId,
  albumTitle = "My Scrapbook",
  albumPurpose = "memories",
}: {
  images: ImageWithNotes[];
  stickyNotes: StickyNote[];
  sectionId: string;
  albumTitle?: string;
  albumPurpose?: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedImage, setExpandedImage] = useState<PrismaImage | null>(null);
  const [stickyNotes, setStickyNotes] = useState(initialStickyNotes);
  const [isSaving, setIsSaving] = useState(false);

  // Global formatting state (applied to new notes / sticky notes)
  const [formatting, setFormatting] = useState({
    fontFamily: "'Caveat', cursive",
    fontSize: 16,
    color: "#1a1a1a",
    isBold: false,
    isItalic: true,
    isUnderline: false,
  });

  const handleFormattingChange = (key: string, value: any) => {
    setFormatting(prev => ({ ...prev, [key]: value }));
  };

  const totalSpreads = Math.ceil(images.length / IMAGES_PER_SPREAD);
  const currentPageStickies = stickyNotes.filter(s => s.page === currentPage);

  // Add a new sticky note
  const handleAddSticky = async () => {
    setIsSaving(true);
    try {
      const randomColor = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
      const result = await addStickyNoteAction(sectionId, currentPage, {
        color: randomColor,
        x: 60 + Math.random() * 20,
        y: 20 + Math.random() * 40,
      });
      // Optimistically add
      setStickyNotes(prev => [...prev, {
        id: result.id || "temp-" + Date.now(),
        sectionId,
        page: currentPage,
        text: "Write here...",
        x: 60 + Math.random() * 20,
        y: 20 + Math.random() * 40,
        color: randomColor,
        fontFamily: "serif",
        fontSize: 14,
        isBold: false,
        isItalic: true,
        isUnderline: false,
        createdAt: new Date(),
      }]);
    } catch (e) { console.error(e); }
    setIsSaving(false);
  };

  // Delete sticky note
  const handleDeleteSticky = async (id: string) => {
    setStickyNotes(prev => prev.filter(s => s.id !== id));
    try {
      await deleteStickyNoteAction(id);
    } catch (e) { console.error(e); }
  };

  // Render page images
  const renderPageContent = (pageImages: ImageWithNotes[], isLeft: boolean) => {
    if (pageImages.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-400 font-serif italic text-lg">The End</p>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative p-4 sm:p-6">
        {pageImages.map((image, idx) => {
          const isTop = idx === 0;
          const defaultRotate = isLeft ? (isTop ? -3 : 2) : (isTop ? 2 : -3);
          const rotate = image.scrapRotate ?? defaultRotate;
          const clipRotate = isLeft ? -15 : 20;

          return (
            <motion.div
              key={image.id}
              drag
              dragMomentum={false}
              onDragEnd={async (_, info) => {
                try {
                  await updateImageScrapPositionAction(image.id, {
                    scrapX: (image.scrapX ?? 0) + info.offset.x / 5,
                    scrapY: (image.scrapY ?? 0) + info.offset.y / 5,
                  });
                } catch (e) { console.error(e); }
              }}
              className="w-full flex items-start gap-3 mb-3 cursor-grab active:cursor-grabbing"
              style={{
                paddingTop: isTop ? "3%" : "1%",
                flexDirection: isLeft ? (isTop ? "row" : "row-reverse") : (isTop ? "row-reverse" : "row"),
              }}
            >
              {/* Polaroid Frame */}
              <div
                className="bg-white p-2 pb-8 shadow-[0_6px_16px_rgba(0,0,0,0.12)] relative flex-shrink-0 w-[55%]"
                style={{ rotate: `${rotate}deg` }}
              >
                {/* Paperclip */}
                <div
                  className="absolute -top-4 -left-2 z-20"
                  style={{ rotate: `${clipRotate}deg` }}
                >
                  <PaperClip />
                </div>

                <img
                  src={image.displayUrl}
                  alt="Scrapbook Memory"
                  className="w-full aspect-[4/3] object-cover pointer-events-none"
                  onClick={() => setExpandedImage(image)}
                />
              </div>

              {/* Inline Editable Note */}
              <div className="flex-1 flex items-start min-h-[60px] pt-2">
                <InlineEditableNote image={image} formatting={formatting} />
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  let leftContent, rightContent;

  if (currentPage === 0) {
    leftContent = (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[#241f1c]">
        <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }} />
      </div>
    );
    rightContent = (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center relative border-[12px] border-double border-gray-300/30">
        <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-8 drop-shadow-sm leading-tight max-w-[80%]">
          {albumTitle}
        </h1>
        <div className="w-24 h-1 bg-gray-400/50 mb-8 rounded-full" />
        <p className="text-xl text-gray-500 uppercase tracking-[0.3em] font-semibold">
          {albumPurpose}
        </p>
      </div>
    );
  } else {
    const startIndex = (currentPage - 1) * IMAGES_PER_SPREAD;
    const leftImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);
    const rightImages = images.slice(startIndex + IMAGES_PER_PAGE, startIndex + IMAGES_PER_SPREAD);
    leftContent = renderPageContent(leftImages, true);
    rightContent = renderPageContent(rightImages, false);
  }

  return (
    <div className="w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative mt-8">
      {/* Google Font for Handwriting */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Formatting Toolbar */}
      <div className="max-w-6xl mx-auto px-4">
        <FormattingToolbar
          formatting={formatting}
          onChange={handleFormattingChange}
          onAddSticky={handleAddSticky}
          isSaving={isSaving}
        />
      </div>

      {/* Sandy background area */}
      <div className="w-full bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')] bg-[#d4cbb8] flex flex-col items-center justify-center relative py-8 px-4 md:px-12 shadow-inner">

        {/* Navigation Controls */}
        <div className="flex items-center gap-6 mb-6 z-10">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-800 disabled:opacity-30 shadow-md hover:bg-gray-50 hover:scale-105 transition-all"
          >
            <ChevronLeft />
          </button>
          <span className="font-serif italic text-gray-800 font-medium bg-white/50 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">
            {currentPage === 0 ? "Cover" : `Spread ${currentPage} of ${totalSpreads}`}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalSpreads, currentPage + 1))}
            disabled={currentPage === totalSpreads}
            className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-800 disabled:opacity-30 shadow-md hover:bg-gray-50 hover:scale-105 transition-all"
          >
            <ChevronRight />
          </button>
        </div>

        {/* The Binder Book */}
        <div className="scrapbook-book w-full max-w-6xl aspect-[4/3] md:aspect-[16/10] relative flex shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-r-3xl rounded-l-3xl overflow-visible bg-[#f4f0e6]">
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-[0.6] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />

          {/* Left Page */}
          <div className="flex-1 h-full relative z-10 rounded-l-3xl shadow-[inset_-20px_0_40px_rgba(0,0,0,0.06)] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${currentPage}`}
                initial={{ opacity: 0, rotateY: 90, originX: 1 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                {leftContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Ring Binder Spine */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 z-40 flex flex-col justify-evenly py-10 pointer-events-none">
            <BinderRing />
            <BinderRing />
            <BinderRing />
            <BinderRing />
            <BinderRing />
            <BinderRing />
          </div>

          {/* Central Shadow */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-black/20 blur-sm z-30 pointer-events-none" />

          {/* Right Page */}
          <div className="flex-1 h-full relative z-10 rounded-r-3xl shadow-[inset_20px_0_40px_rgba(0,0,0,0.06)] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${currentPage}`}
                initial={{ opacity: 0, rotateY: -90, originX: 0 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                {rightContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Notes for this page */}
          {currentPageStickies.map((sticky) => (
            <EditableStickyNote
              key={sticky.id}
              sticky={sticky}
              formatting={formatting}
              onDelete={handleDeleteSticky}
            />
          ))}
        </div>
      </div>

      {/* Expanded Modal */}
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
              className="p-4 bg-white pb-16 shadow-2xl relative"
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
    </div>
  );
}
