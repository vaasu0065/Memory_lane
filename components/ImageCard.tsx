"use client";

import { Image, Note } from "@prisma/client";
import { motion } from "framer-motion";
import NoteOverlay from "./NoteOverlay";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { deleteImageAction } from "@/app/actions/deleteImage";
import { useTransition } from "react";

interface ImageCardProps {
  image: Image & { notes?: Note[] };
  index: number;
  layoutType: string;
  onClick?: () => void;
}

export default function ImageCard({ image, index, layoutType, onClick }: ImageCardProps) {
  const [isPending, startTransition] = useTransition();

  // Slider layout now also acts as a Polaroid card
  const isPolaroid = layoutType === "polaroid" || layoutType === "slider";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this memory?")) {
      startTransition(async () => {
        await deleteImageAction(image.id);
      });
    }
  };

  // Hydration-safe date formatter
  const formatDate = (dateString: Date | string) => {
    const d = new Date(dateString);
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, filter: "blur(10px) grayscale(100%)" }}
      whileInView={{ opacity: 1, filter: "blur(0px) grayscale(0%)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={clsx(
        "relative group h-full w-full",
        isPolaroid 
          ? "bg-[#FCFBFA] p-3 pb-14 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/5 transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:z-20 z-10 cursor-pointer"
          : "shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-sm overflow-hidden"
      )}
    >
      {/* The Pushpin */}
      {isPolaroid && (
        <div className="absolute -top-3 right-4 w-6 h-6 z-30 drop-shadow-md">
          {/* Pin head */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-inner relative flex items-center justify-center">
            {/* Specular highlight */}
            <div className="w-2 h-2 rounded-full bg-white/40 absolute top-1 left-1 blur-[1px]"></div>
          </div>
          {/* Pin shadow */}
          <div className="w-8 h-2 bg-black/20 rounded-full blur-[2px] absolute -bottom-1 -left-2 transform rotate-12"></div>
        </div>
      )}

      <img
        src={image.thumbUrl}
        alt={`Photo uploaded on ${formatDate(image.uploadedAt)}`}
        className={clsx(
          "w-full h-full object-cover transition-transform duration-700",
          !isPolaroid && "group-hover:scale-105 rounded-sm",
          isPending && "opacity-50"
        )}
      />

      {/* Delete Button (Visible on Hover) */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-4 left-4 z-40 bg-black/40 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-sm"
        title="Delete this memory"
      >
        <Trash2 size={16} />
      </button>

      {/* Date Stamp */}
      {image.takenAt && (
        isPolaroid ? (
          <div className="absolute bottom-4 right-4 text-ink/70 text-sm font-serif transform rotate-[-2deg]">
            {formatDate(image.takenAt)}
          </div>
        ) : (
          <div className="absolute bottom-2 right-2 bg-stamp text-ink text-xs font-serif px-2 py-1 transform rotate-[-2deg] opacity-80 shadow-sm border border-black/10">
            {formatDate(image.takenAt)}
          </div>
        )
      )}

      {/* Notes */}
      {image.notes?.map((note) => (
        <NoteOverlay key={note.id} note={note} />
      ))}
    </motion.div>
  );
}
