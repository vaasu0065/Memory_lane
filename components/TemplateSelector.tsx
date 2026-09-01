"use client";

import { useState, useTransition } from "react";
import { updateSectionTheme, updateCustomCss } from "@/app/actions/updateSection";
import clsx from "clsx";
import { LayoutGrid, Film, Layers, Check, Code, Loader2, Orbit } from "lucide-react";

interface Props {
  sectionId: string;
  currentTheme: string;
  currentCustomCssUrl?: string | null;
}

// ... templates ...
const TEMPLATES = [
  {
    id: "everyday",
    title: "The Mosaic",
    description: "A beautiful masonry grid aesthetic.",
    icon: LayoutGrid,
  },
  {
    id: "travel",
    title: "Cinematic Filmstrip",
    description: "A seamless, horizontally scrolling marquee.",
    icon: Film,
  },
  {
    id: "event",
    title: "Polaroid Pile",
    description: "A scattered, messy pile of memories.",
    icon: Layers,
  },
  {
    id: "tunnel",
    title: "3D Tunnel Grid",
    description: "Fly through your memories in a 3D perspective.",
    icon: LayoutGrid, // Using LayoutGrid for now as placeholder for 3D box
  },
  {
    id: "ribbon",
    title: "Ribbon Loop",
    description: "A sweeping, roller-coaster loop in 3D space.",
    icon: Orbit,
  }
];

export default function TemplateSelector({ sectionId, currentTheme, currentCustomCssUrl }: Props) {
  const [isPending, startTransition] = useTransition();
  const [cssUrl, setCssUrl] = useState(currentCustomCssUrl || "");

  const handleSelect = (theme: string) => {
    if (theme === currentTheme) return;
    startTransition(async () => {
      await updateSectionTheme(sectionId, theme);
    });
  };

  const handleApplyCss = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateCustomCss(sectionId, cssUrl);
    });
  };

  return (
    <div className="mb-12 space-y-8">
      <div>
        <h3 className="font-serif italic text-2xl font-semibold text-white drop-shadow-md mb-6">Choose a Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {TEMPLATES.map((template) => {
            const isSelected = currentTheme === template.id;
            const Icon = template.icon;
            
            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                disabled={isPending}
                className={clsx(
                  "relative flex flex-col items-start p-6 rounded-3xl transition-all duration-300 text-left border-2 backdrop-blur-md overflow-hidden group",
                  isSelected 
                    ? "bg-white/20 border-white shadow-[0_8px_30px_rgb(0,0,0,0.3)] scale-[1.02]" 
                    : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 shadow-sm disabled:opacity-50"
                )}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-white text-black p-1 rounded-full shadow-sm">
                    <Check size={16} />
                  </div>
                )}
                
                <div className={clsx(
                  "p-3 rounded-2xl mb-4 transition-colors",
                  isSelected ? "bg-white/20 text-white" : "bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white"
                )}>
                  <Icon size={28} />
                </div>
                
                <h4 className="font-serif text-xl font-bold text-white mb-2">{template.title}</h4>
                <p className="text-sm text-white/70 font-medium">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced CSS Reskin Option */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
        <div className="flex items-center gap-2 mb-2">
          <Code size={18} className="text-white" />
          <h4 className="font-serif text-xl font-bold text-white">Custom CSS Reskin</h4>
        </div>
        <p className="text-sm text-white/70 font-medium mb-4">Paste a link to an external CSS stylesheet to completely reskin the aesthetics of this album.</p>
        
        <form onSubmit={handleApplyCss} className="flex gap-2 max-w-2xl">
          <input 
            type="url" 
            placeholder="https://example.com/styles/my-album-theme.css" 
            value={cssUrl}
            onChange={(e) => setCssUrl(e.target.value)}
            className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <button 
            type="submit"
            disabled={isPending}
            className="bg-white/20 border border-white/30 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition-colors disabled:opacity-50 flex items-center justify-center font-medium"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : "Apply Style"}
          </button>
          
          {currentCustomCssUrl && (
            <button 
              type="button"
              disabled={isPending}
              onClick={() => {
                setCssUrl("");
                startTransition(async () => {
                  await updateCustomCss(sectionId, "");
                });
              }}
              className="bg-red-500/10 text-red-600 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-colors font-medium border border-red-500/20"
            >
              Reset
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
