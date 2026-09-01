"use client";

import { Note } from "@prisma/client";
import { motion } from "framer-motion";

interface NoteOverlayProps {
  note: Note;
}

export default function NoteOverlay({ note }: NoteOverlayProps) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      className="absolute cursor-grab active:cursor-grabbing font-sans text-sm shadow-md border border-black/10 z-20"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        backgroundColor: note.color,
        color: "#2B2A28",
        padding: "8px 12px",
        transform: "translate(-50%, -50%) rotate(-3deg)",
      }}
    >
      {note.text}
    </motion.div>
  );
}
