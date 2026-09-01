"use client";

import { Image as PrismaImage, Note } from "@prisma/client";
import PhotoAlbum from "react-photo-album";
import ImageCard from "../ImageCard";

interface MosaicLayoutProps {
  images: (PrismaImage & { notes?: Note[] })[];
}

export default function MosaicLayout({ images }: MosaicLayoutProps) {
  const photos = images.map((image) => ({
    src: image.thumbUrl,
    width: image.width || 800,
    height: image.height || 600,
    image,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 album-mosaic-container">
      <PhotoAlbum
        layout="masonry"
        photos={photos}
        spacing={24}
        columns={(containerWidth) => {
          if (containerWidth < 600) return 1;
          if (containerWidth < 900) return 2;
          if (containerWidth < 1200) return 3;
          return 4;
        }}
        render={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          photo: (props: any, context: any) => {
            const customPhoto = context.photo as typeof photos[0];
            return (
              <div 
                {...props} 
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 album-mosaic-item"
                style={{ ...props.style, position: "relative" }}
              >
                <ImageCard
                  image={customPhoto.image}
                  index={context.index}
                  layoutType="mosaic"
                />
              </div>
            );
          }
        }}
      />
    </div>
  );
}
