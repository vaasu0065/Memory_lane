"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Update note text + formatting
export async function updateNoteAction(
  noteId: string,
  data: { 
    text?: string; 
    fontFamily?: string; 
    fontSize?: number; 
    color?: string;
    isBold?: boolean; 
    isItalic?: boolean; 
    isUnderline?: boolean; 
  }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { image: { include: { section: true } } },
  });

  if (!note || note.image.section.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.note.update({
    where: { id: noteId },
    data,
  });

  revalidatePath(`/section/${note.image.sectionId}`);
  return { success: true };
}

// Add a sticky note to a scrapbook page
export async function addStickyNoteAction(
  sectionId: string,
  page: number,
  data?: { text?: string; x?: number; y?: number; color?: string }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const section = await prisma.section.findUnique({
    where: { id: sectionId, userId: session.user.id },
  });

  if (!section) throw new Error("Section not found");

  const sticky = await prisma.stickyNote.create({
    data: {
      sectionId,
      page,
      text: data?.text || "Write here...",
      x: data?.x ?? 70,
      y: data?.y ?? 30,
      color: data?.color || "#fef08a",
    },
  });

  revalidatePath(`/section/${sectionId}`);
  return { success: true, id: sticky.id };
}

// Update a sticky note (text, position, formatting)
export async function updateStickyNoteAction(
  stickyId: string,
  data: {
    text?: string;
    x?: number;
    y?: number;
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
  }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const sticky = await prisma.stickyNote.findUnique({
    where: { id: stickyId },
    include: { section: true },
  });

  if (!sticky || sticky.section.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.stickyNote.update({
    where: { id: stickyId },
    data,
  });

  revalidatePath(`/section/${sticky.sectionId}`);
  return { success: true };
}

// Delete a sticky note
export async function deleteStickyNoteAction(stickyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const sticky = await prisma.stickyNote.findUnique({
    where: { id: stickyId },
    include: { section: true },
  });

  if (!sticky || sticky.section.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.stickyNote.delete({ where: { id: stickyId } });

  revalidatePath(`/section/${sticky.sectionId}`);
  return { success: true };
}

// Update image position in scrapbook
export async function updateImageScrapPositionAction(
  imageId: string,
  data: { scrapX?: number; scrapY?: number; scrapRotate?: number }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: { section: true },
  });

  if (!image || image.section.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.image.update({
    where: { id: imageId },
    data,
  });

  revalidatePath(`/section/${image.sectionId}`);
  return { success: true };
}
