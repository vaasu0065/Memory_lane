"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteImageAction(imageId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: { section: true },
  });

  if (!image) {
    return { error: "Image not found" };
  }

  if (image.section.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  // Delete the image (Note: Prisma will also delete related Notes if cascade delete was setup, but we don't have cascade on Notes, so we must delete them first)
  await prisma.note.deleteMany({
    where: { imageId },
  });

  await prisma.image.delete({
    where: { id: imageId },
  });

  revalidatePath(`/section/${image.sectionId}`);
  
  return { success: true };
}
