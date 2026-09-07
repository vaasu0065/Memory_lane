"use client";

import { useState, useRef, useEffect } from "react";
import { updateSectionTitle } from "@/app/actions/updateSection";
import { Edit2, Check, X } from "lucide-react";

export default function EditableTitle({ sectionId, initialTitle }: { sectionId: string, initialTitle: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isPending, setIsPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (title.trim() === "" || title === initialTitle) {
      setIsEditing(false);
      setTitle(initialTitle);
      return;
    }
    
    setIsPending(true);
    const res = await updateSectionTitle(sectionId, title.trim());
    setIsPending(false);
    
    if (res.success) {
      setIsEditing(false);
    } else {
      alert("Failed to update title");
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 mb-3">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setTitle(initialTitle);
            }
          }}
          disabled={isPending}
          className="font-serif italic text-4xl md:text-5xl font-semibold text-gray-900 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-gray-300 w-full max-w-xl"
        />
        <button 
          onClick={handleSave} 
          disabled={isPending}
          className="p-3 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-gray-900 rounded-full transition-colors"
        >
          <Check size={20} />
        </button>
        <button 
          onClick={() => {
            setIsEditing(false);
            setTitle(initialTitle);
          }} 
          disabled={isPending}
          className="p-3 bg-white hover:bg-white shadow-sm text-gray-700 hover:text-gray-900 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-4 mb-3">
      <h1 className="font-serif italic text-5xl font-semibold text-gray-900 drop-shadow-md tracking-wide album-title">
        {title}
      </h1>
      <button 
        onClick={() => setIsEditing(true)}
        className="p-2 bg-white hover:bg-white shadow-sm text-gray-500 hover:text-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        title="Edit Album Title"
      >
        <Edit2 size={18} />
      </button>
    </div>
  );
}
