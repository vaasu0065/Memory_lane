"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, Link as LinkIcon, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StagedItem {
  id: string;
  url: string;
  isExternal: boolean;
  file?: File;
  width?: number;
  height?: number;
}

export default function UploadDropzone({ sectionId }: { sectionId: string }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stagedItems, setStagedItems] = useState<StagedItem[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (files: File[]) => {
    const newItems = files.map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: Math.random().toString(36).substring(7),
        url,
        isExternal: false,
        file
      };
    });
    setStagedItems(prev => [...prev, ...newItems]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    handleAddFiles(files);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
      handleAddFiles(files);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    // We load the image first to verify it's valid and grab its dimensions
    const img = new window.Image();
    img.onload = () => {
      setStagedItems(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        url: urlInput,
        isExternal: true,
        width: img.naturalWidth,
        height: img.naturalHeight
      }]);
      setUrlInput("");
    };
    img.onerror = () => {
      alert("Could not load image from that URL. Please make sure it is a direct image link.");
    };
    img.src = urlInput;
  };

  const removeStagedItem = (id: string) => {
    setStagedItems(prev => prev.filter(item => item.id !== id));
  };

  const confirmUpload = async () => {
    if (stagedItems.length === 0) return;
    setIsUploading(true);
    
    for (const item of stagedItems) {
      try {
        if (item.isExternal) {
          // Save external URL directly
          await fetch("/api/upload/external", {
            method: "POST",
            body: JSON.stringify({ 
              url: item.url, 
              sectionId, 
              width: item.width, 
              height: item.height 
            }),
            headers: { "Content-Type": "application/json" }
          });
        } else if (item.file) {
          // Standard R2/Mock upload flow for local files
          const presignRes = await fetch("/api/upload/presign", {
            method: "POST",
            body: JSON.stringify({ filename: item.file.name, contentType: item.file.type }),
          });
          const { url, key } = await presignRes.json();

          await fetch(url, {
            method: "PUT",
            body: item.file,
            headers: { "Content-Type": item.file.type },
          });

          await fetch("/api/upload/complete", {
            method: "POST",
            body: JSON.stringify({ key, sectionId }),
          });
        }
      } catch (err) {
        console.error("Failed to process item:", item, err);
      }
    }
    
    setIsUploading(false);
    setStagedItems([]);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Input Controls Container */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Local File Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`h-full min-h-[160px] flex items-center justify-center border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer backdrop-blur-md ${
            isDragging 
              ? "border-white/80 bg-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.1)]" 
              : "border-white/40 bg-white/10 hover:bg-white/30 hover:border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          }`}
        >
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleChange}
          />
          <div className="flex flex-col items-center gap-3">
            <UploadCloud size={32} className={isDragging ? "text-ink drop-shadow-sm" : "text-ink/60"} />
            <div className="text-sm text-ink/70 font-medium">
              <span className="font-bold text-ink drop-shadow-sm">Click to upload</span> or drag files here
            </div>
          </div>
        </div>

        {/* URL Import */}
        <div className="h-full min-h-[160px] flex flex-col justify-center border-2 border-white/20 rounded-3xl p-6 bg-white/20 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4 text-ink/80 font-medium">
            <LinkIcon size={18} /> Import from URL
          </div>
          <form onSubmit={handleAddUrl} className="flex gap-2">
            <input 
              type="url" 
              placeholder="Paste an image URL here..." 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-white/40 border border-white/50 rounded-xl px-4 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <button 
              type="submit"
              disabled={!urlInput}
              className="bg-ink text-paper px-4 py-2 rounded-xl hover:bg-ink/80 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic Staging Area */}
      {stagedItems.length > 0 && (
        <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-[0_16px_60px_rgb(0,0,0,0.1)] mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif italic text-2xl font-semibold text-ink drop-shadow-sm">Ready to Archive</h3>
            <button 
              onClick={confirmUpload}
              disabled={isUploading}
              className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isUploading ? (
                <><Loader2 size={18} className="animate-spin" /> Saving Memories...</>
              ) : (
                <><UploadCloud size={18} /> Confirm & Save</>
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <AnimatePresence>
              {stagedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20, rotate: (Math.random() - 0.5) * 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: (Math.random() - 0.5) * 6 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative bg-white p-3 pb-12 rounded-sm shadow-xl"
                  style={{ width: 220, height: 260 }}
                >
                  <img src={item.url} alt="Staged" className="w-full h-full object-cover rounded-sm" />
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => removeStagedItem(item.id)}
                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-colors z-10"
                  >
                    <X size={16} />
                  </button>

                  {/* Badge for External URL */}
                  {item.isExternal && (
                    <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold text-ink/40 uppercase tracking-widest">
                      Imported Link
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
