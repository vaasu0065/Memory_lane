"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addNoteAction(
  imageId: string, 
  text: string, 
  formatting?: { fontFamily: string; fontSize: number; color: string; isBold: boolean; isItalic: boolean; isUnderline: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify the image exists and belongs to the user
  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: { section: true, notes: true },
  });

  if (!image || image.section.userId !== session.user.id) {
    throw new Error("Unauthorized or image not found");
  }

  // If a note already exists, update it; otherwise create a new one
  if (image.notes.length > 0) {
    await prisma.note.update({
      where: { id: image.notes[0].id },
      data: { text },
    });
  } else {
    await prisma.note.create({
      data: {
        imageId,
        text,
        x: 0,
        y: 0,
        color: formatting?.color || "#1a1a1a",
        fontFamily: formatting?.fontFamily || "serif",
        fontSize: formatting?.fontSize || 14,
        isBold: formatting?.isBold || false,
        isItalic: formatting?.isItalic ?? true,
        isUnderline: formatting?.isUnderline || false,
      },
    });
  }

  revalidatePath(`/section/${image.sectionId}`);
  return { success: true };
}
