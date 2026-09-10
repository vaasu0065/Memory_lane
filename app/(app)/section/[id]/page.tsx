export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import FixedSlotEditor from "@/components/FixedSlotEditor";

export default async function SectionPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const section = await prisma.section.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: { 
      images: { include: { notes: true }, orderBy: { position: "asc" } },
    },
  });

  if (!section) notFound();

  return <FixedSlotEditor section={section} />;
}
