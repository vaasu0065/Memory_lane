"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteSection } from "@/app/actions/deleteSection";
import { useRouter } from "next/navigation";

export default function DeleteSectionButton({ sectionId }: { sectionId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this entire album? All photos and notes will be permanently lost. This cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteSection(sectionId);
      if (res.success) {
        router.push("/home");
      } else {
        alert("Failed to delete album");
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="relative z-10 group flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm border border-red-500/20 hover:border-red-500 disabled:opacity-50"
      title="Delete Album"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      <span className="hidden sm:inline">Delete Album</span>
    </button>
  );
}
