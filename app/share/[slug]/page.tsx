export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getLayoutComponent } from "@/lib/theme-to-layout";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const section = await prisma.section.findFirst({
    where: { OR: [{ shareSlug: params.slug }, { id: params.slug }] },
    include: { user: true, images: { take: 1 } },
  });

  if (!section || !section.isPublic) return { title: "Not Found" };

  return {
    title: `${section.title} | Memory Lane`,
    description: `A photo album by ${section.user.name || section.user.email}`,
    openGraph: {
      images: section.images[0] ? [section.images[0].displayUrl] : [],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const section = await prisma.section.findFirst({
    where: { OR: [{ shareSlug: params.slug }, { id: params.slug }] },
    include: { user: true, images: { include: { notes: true }, orderBy: { uploadedAt: "asc" } } },
  });

  if (!section || !section.isPublic) notFound();

  const Layout = getLayoutComponent(section.theme);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="mb-12 border-b border-muted pb-4 text-center">
        <h1 className="font-serif text-5xl font-bold text-ink mb-2">{section.title}</h1>
        <p className="text-muted capitalize">A Memory Lane by {section.user.name || section.user.email}</p>
      </div>

      <div className="w-full bg-black/5 rounded py-8 relative">
        {section.images.length > 0 ? (
          <Layout images={section.images} />
        ) : (
          <p className="text-center text-muted p-12">This album is empty.</p>
        )}
      </div>
    </div>
  );
}
