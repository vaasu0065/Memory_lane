import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getLayoutComponent } from "@/lib/theme-to-layout";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const idOrSlug = params.id;
  const section = await prisma.section.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { shareSlug: idOrSlug }
      ]
    },
    include: {
      images: {
        take: 1,
        orderBy: { uploadedAt: "asc" }
      }
    }
  });

  if (!section) {
    return { title: "Album Not Found | Memory Lane" };
  }

  const imageUrl = section.images.length > 0 ? section.images[0].displayUrl : null;

  return {
    title: `${section.title} | Memory Lane`,
    description: "Check out my memory album!",
    openGraph: {
      title: section.title,
      description: "View my memory album created with Memory Lane.",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: section.title,
      description: "View my memory album created with Memory Lane.",
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function PublicSharePage({ params }: Props) {
  const idOrSlug = params.id;

  const section = await prisma.section.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { shareSlug: idOrSlug }
      ]
    },
    include: { images: { include: { notes: true }, orderBy: { uploadedAt: "asc" } } },
  });

  if (!section) notFound();

  const Layout = getLayoutComponent(section.theme);

  return (
    <div className="min-h-screen max-w-7xl mx-auto overflow-hidden px-8">
      {(section as any).customCssUrl && (
        <link rel="stylesheet" href={(section as any).customCssUrl} />
      )}

      {/* Floating Header */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex justify-between items-center bg-black/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/10 px-8 py-4 rounded-full">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-wide">
            {section.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white uppercase tracking-widest shadow-sm">
              {section.theme}
            </span>
            <span className="text-xs font-medium text-white/70">
              • {section.images.length} memories
            </span>
          </div>
        </div>
        
        <Link 
          href="/login" 
          className="bg-white/90 text-black hover:bg-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm hidden md:block"
        >
          Create your own
        </Link>
      </header>

      {section.images.length > 0 ? (
        <div className="w-full py-8 relative pt-[120px]">
          <Layout images={section.images} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen text-white/50 text-xl font-serif italic">
          This album is empty.
        </div>
      )}

      {/* Mobile CTA */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden">
         <Link 
          href="/login" 
          className="bg-white/90 text-black hover:bg-white px-6 py-3 rounded-full font-medium transition-all shadow-lg text-sm whitespace-nowrap"
        >
          Create your own Memory Lane
        </Link>
      </div>
    </div>
  );
}
