import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Image as PrismaImage } from "@prisma/client";

const FilmstripLayout = dynamic(() => import("@/components/layouts/FilmstripLayout"));
const PolaroidPileLayout = dynamic(() => import("@/components/layouts/PolaroidPileLayout"));
const MosaicLayout = dynamic(() => import("@/components/layouts/MosaicLayout"));
const TunnelGridLayout = dynamic(() => import("@/components/layouts/TunnelGridLayout"));
const TwistedFilmstrip = dynamic(() => import("@/components/layouts/3d/TwistedFilmstrip"), { ssr: false });

export type LayoutComponent = ComponentType<{ images: PrismaImage[] }>;

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
    default:
      return FilmstripLayout;
  }
}
