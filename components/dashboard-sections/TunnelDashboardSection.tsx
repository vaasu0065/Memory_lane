"use client";

import Link from "next/link";
import { Heart, Users, MoreHorizontal } from "lucide-react";
import { getLayoutComponent } from "@/lib/theme-to-layout";

const TunnelGridLayout = getLayoutComponent("tunnel");

export default function TunnelDashboardSection({ section }: { section: any }) {
  return (
    <section
      className="flex flex-col md:flex-row group relative items-center py-12 md:py-20"
      style={{ isolation: "isolate" }}
    >
      {/* LEFT SIDE: Metadata */}
      <div
        className="py-10 pr-10 pl-0 md:py-14 md:pr-14 flex flex-col justify-center w-full md:w-[35%] flex-shrink-0 relative"
        style={{ zIndex: 20, isolation: "isolate" }}
      >
        <div className="mb-8 rotate-[-3deg]">
          <Heart size={20} className="text-gray-400 mb-2 ml-4" />
          <p className="font-handwriting text-3xl md:text-4xl text-gray-500 leading-tight whitespace-pre-line ml-4">
            {`Good\nMemories\nLast Forever`}
          </p>
        </div>

        <div>
          <h2 className="font-serif italic text-5xl lg:text-7xl font-bold text-[#1f2937] tracking-tight mb-2 drop-shadow-sm">
            {section.title}
          </h2>
          <p className="font-handwriting text-2xl text-gray-600 mb-6 flex items-center gap-2">
            A collection of little moments <Heart size={16} className="text-gray-500" />
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-4 py-2 rounded-full bg-[#f3f4f6] text-sm font-semibold text-[#4b5563] shadow-sm flex items-center gap-2">
              <Users size={16} className="text-indigo-600" />
              <span className="capitalize">
                {section.purpose !== "other" ? section.purpose : "Album"}
              </span>
            </span>
            <span className="text-sm font-medium text-slate-500">
              • {section.images.length} memories
            </span>
          </div>

          <p className="text-gray-600/90 font-medium leading-relaxed max-w-sm mb-10">
            These are some of my favorite moments with {section.purpose} — little pieces of life
            that make the big picture beautiful.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/section/${section.id}`}
            className="inline-flex items-center gap-2 bg-[#2a2b4b] hover:bg-[#1a1b3b] text-white px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            View & Edit
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.preventDefault();
                const dropdown = e.currentTarget.nextElementSibling;
                if (dropdown) dropdown.classList.toggle('hidden');
              }}
              className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all hover:-translate-y-1"
            >
              <MoreHorizontal size={24} />
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 hidden">
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(`${window.location.origin}/share/${section.id}`);
                   alert("Share link copied to clipboard!");
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                Share Template
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: Tunnel Grid preview — no box, blends into page */}
      <div
        className="w-full md:w-[65%] flex-shrink-0 relative"
        style={{ height: 560, zIndex: 10, marginRight: "-2rem" }}
      >
        <div className="absolute inset-0">
          <TunnelGridLayout
            images={section.images}
            previewMode={true}
          />
        </div>
      </div>
    </section>
  );
}
