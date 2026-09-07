"use client";

import { useState } from "react";
import Link from "next/link";
import { getLayoutComponent } from "@/lib/theme-to-layout";
import { Heart, Users, MoreHorizontal } from "lucide-react";
import ScrapbookDashboardSection from "@/components/dashboard-sections/ScrapbookDashboardSection";
import SpotlightGalleryDashboardSection from "@/components/dashboard-sections/SpotlightGalleryDashboardSection";
import FloatingBubblesDashboardSection from "@/components/dashboard-sections/FloatingBubblesDashboardSection";
import CoverFlowDashboardSection from "@/components/dashboard-sections/CoverFlowDashboardSection";
import CarouselDashboardSection from "@/components/dashboard-sections/CarouselDashboardSection";
import PolaroidPileDashboardSection from "@/components/dashboard-sections/PolaroidPileDashboardSection";
import FilmstripDashboardSection from "@/components/dashboard-sections/FilmstripDashboardSection";
import MosaicDashboardSection from "@/components/dashboard-sections/MosaicDashboardSection";
import TunnelDashboardSection from "@/components/dashboard-sections/TunnelDashboardSection";
import RibbonDashboardSection from "@/components/dashboard-sections/RibbonDashboardSection";

const PURPOSES = [
  { value: "all", label: "All Albums" },
  { value: "travel", label: "Travel & Vacations" },
  { value: "event", label: "Event & Parties" },
  { value: "family", label: "Family" },
  { value: "everyday", label: "Everyday" },
  { value: "other", label: "Other" },
];

export default function HomeAlbumList({ sections }: { sections: any[] }) {
  const [filter, setFilter] = useState("all");

  const filteredSections = filter === "all" 
    ? sections 
    : sections.filter(s => s.purpose === filter);

  return (
    <div className="space-y-12">
      {/* Filter Bar */}
      {sections.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 justify-center pb-8 border-b border-gray-200">
          {PURPOSES.map((p) => {
            // Only show filter if there are actually albums of this type (or if it's 'all')
            if (p.value !== "all" && !sections.some(s => s.purpose === p.value)) return null;
            
            return (
              <button
                key={p.value}
                onClick={() => setFilter(p.value)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm tracking-wide shadow-sm border ${
                  filter === p.value 
                    ? "bg-indigo-900 text-white border-indigo-900 shadow-md shadow-indigo-900/20" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-900"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Album List */}
      <div className="space-y-40 md:space-y-56">
        {filteredSections.length === 0 ? (
          <div className="text-center text-gray-500 border-2 border-dashed border-gray-200 p-12 rounded-3xl backdrop-blur-sm bg-white">
            <p className="text-lg font-serif italic">
              {filter === "all" ? "No albums yet. Start archiving your memories!" : "No albums found for this category."}
            </p>
          </div>
        ) : (
          filteredSections.map((section) => {
            // ── Scrapbook albums ──
            if (section.theme === "scrapbook") {
              return <ScrapbookDashboardSection key={section.id} section={section} />;
            }

            // ── Spotlight Gallery albums ──
            if (section.theme === "spotlight") {
              return <SpotlightGalleryDashboardSection key={section.id} section={section} />;
            }

            // ── Floating Bubbles albums ──
            if (section.theme === "bubbles") {
              return <FloatingBubblesDashboardSection key={section.id} section={section} />;
            }

            // ── Cover Flow albums ──
            if (section.theme === "cover-flow") {
              return <CoverFlowDashboardSection key={section.id} section={section} />;
            }

            // ── Carousel albums ──
            if (section.theme === "carousel") {
              return <CarouselDashboardSection key={section.id} section={section} />;
            }

            // ── Polaroid Pile albums ──
            if (section.theme === "event" || section.theme === "birthday") {
              return <PolaroidPileDashboardSection key={section.id} section={section} />;
            }

            // ── Filmstrip albums ──
            if (section.theme === "travel") {
              return <FilmstripDashboardSection key={section.id} section={section} />;
            }

            // ── Tunnel Grid albums ──
            if (section.theme === "tunnel") {
              return <TunnelDashboardSection key={section.id} section={section} />;
            }

            // ── Twisted Filmstrip (Ribbon) albums ──
            if (section.theme === "ribbon") {
              return <RibbonDashboardSection key={section.id} section={section} />;
            }

            // ── Mosaic albums (Default) ──
            // If the theme is "everyday" or if it somehow missed all other checks
            return <MosaicDashboardSection key={section.id} section={section} />;
          })
        )}
      </div>
    </div>
  );
}
