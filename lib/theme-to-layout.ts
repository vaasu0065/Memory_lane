import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Image as PrismaImage } from "@prisma/client";

const FilmstripLayout = dynamic(() => import("@/components/layouts/FilmstripLayout"));
const PolaroidPileLayout = dynamic(() => import("@/components/layouts/PolaroidPileLayout"));
const MosaicLayout = dynamic(() => import("@/components/layouts/MosaicLayout"));
const TunnelGridLayout = dynamic(() => import("@/components/layouts/TunnelGridLayout"));
const TwistedFilmstrip = dynamic(() => import("@/components/layouts/3d/TwistedFilmstrip"), { ssr: false });
const CarouselLayout = dynamic(() => import("@/components/layouts/CarouselLayout"));
const CoverFlowLayout = dynamic(() => import("@/components/layouts/CoverFlowLayout"));
const ScrapbookLayout = dynamic(() => import("@/components/layouts/ScrapbookLayout"));
const SpotlightGallery = dynamic(() => import("@/components/layouts/SpotlightGallery"));
const FloatingBubblesLayout = dynamic(() => import("@/components/layouts/FloatingBubblesLayout"));

export type LayoutComponent = ComponentType<{ 
  images: PrismaImage[], 
  stickyNotes?: any[],
  albumTitle?: string, 
  albumPurpose?: string,
  previewMode?: boolean
}>;

export function getLayoutComponent(theme: string): LayoutComponent {
  switch (theme) {
    case "travel":
      return FilmstripLayout;
    case "event":
    case "birthday":
      return PolaroidPileLayout;
    case "everyday":
      return MosaicLayout;
    case "tunnel":
      return TunnelGridLayout;
    case "ribbon":
      return TwistedFilmstrip;
    case "carousel":
      return CarouselLayout;
    case "cover-flow":
      return CoverFlowLayout;
    case "scrapbook":
      return ScrapbookLayout;
    case "spotlight":
      return SpotlightGallery;
    case "bubbles":
      return FloatingBubblesLayout;
    default:
      return MosaicLayout;
  }
}
