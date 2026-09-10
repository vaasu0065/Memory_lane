import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import FamilyViewPage from "@/components/purpose-views/FamilyViewPage";
import DefaultViewPage from "@/components/purpose-views/DefaultViewPage";

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
        orderBy: { position: "asc" }
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
    include: { 
      images: { include: { notes: true }, orderBy: { position: "asc" } },
      stickyNotes: true,
    },
  });

  if (!section) notFound();

  // Dispatch to Dedicated Purpose Views
  switch (section.purpose) {
    case "family":
      return <FamilyViewPage section={section} />;
    default:
      return <DefaultViewPage section={section} />;
  }
}
