"use client";

import { useTransition } from "react";
import { Image as PrismaImage } from "@prisma/client";
import { deleteImageAction } from "@/app/actions/deleteImage";
import { Trash2, Loader2 } from "lucide-react";

export default function ManageImagesGrid({ images }: { images: PrismaImage[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] mt-8">
      <h3 className="font-serif italic text-2xl font-semibold text-white drop-shadow-md mb-4 tracking-wide">
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

function ManageImageCard({ image }: { image: PrismaImage }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    startTransition(async () => {
      const res = await deleteImageAction(image.id);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-white/20 bg-black/20">
      <img 
        src={image.thumbUrl || image.displayUrl} 
        alt="Memory" 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
  );
}
