"use client";

import { useState, useTransition } from "react";
import { Image as PrismaImage, Note } from "@prisma/client";
import { deleteImageAction } from "@/app/actions/deleteImage";
import { addNoteAction } from "@/app/actions/addNote";
import { Trash2, Loader2, MessageSquarePlus, Check, X } from "lucide-react";

type ImageWithNotes = PrismaImage & { notes: Note[] };

export default function ManageImagesGrid({ images }: { images: ImageWithNotes[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white backdrop-blur-md border border-gray-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] mt-8">
      <h3 className="font-serif italic text-2xl font-semibold text-gray-900 drop-shadow-md mb-4 tracking-wide">
        Manage Memories
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {images.map((img) => (
          <ManageImageCard key={img.id} image={img} />
        ))}
      </div>
    </div>
  );
}

function ManageImageCard({ image }: { image: ImageWithNotes }) {
  const [isPending, startTransition] = useTransition();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    startTransition(async () => {
      const res = await deleteImageAction(image.id);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setIsSaving(true);
    try {
      await addNoteAction(image.id, noteText.trim());
      setNoteText("");
      setIsAddingNote(false);
    } catch (e: any) {
      alert(e.message || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const existingNote = image.notes?.[0]?.text;

  return (
    <div className="flex flex-col">
      <div className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-black/20">
        <img 
          src={image.thumbUrl || image.displayUrl} 
          alt="Memory" 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
            title="Add a note"
          >
            <MessageSquarePlus size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all disabled:opacity-50"
            title="Delete this image"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>

      {/* Existing note preview */}
      {existingNote && !isAddingNote && (
        <p className="mt-1.5 text-xs text-gray-600 font-serif italic truncate px-1" title={existingNote}>
          ✍ {existingNote}
        </p>
      )}

      {/* Add/Edit Note Input */}
      {isAddingNote && (
        <div className="mt-2 flex flex-col gap-1.5">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={existingNote || "Write a note..."}
            rows={2}
            className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-serif italic"
          />
          <div className="flex gap-1">
            <button 
              onClick={handleSaveNote} 
              disabled={isSaving || !noteText.trim()}
              className="flex-1 flex items-center justify-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-2 py-1.5 font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Save
            </button>
            <button 
              onClick={() => { setIsAddingNote(false); setNoteText(""); }}
              className="flex items-center justify-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-2 py-1.5 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
