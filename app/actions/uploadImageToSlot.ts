"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function uploadImageToSlotAction({
  url,
  sectionId,
  position,
  width,
  height,
  allowMultiple = false,
}: {
  url: string;
  sectionId: string;
  position: number;
  width?: number;
  height?: number;
  allowMultiple?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify the section belongs to the user
  const section = await prisma.section.findUnique({
    where: { id: sectionId }
  });

  if (!section || section.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Find if an image already exists at this position
  let existingImage = null;
  if (!allowMultiple) {
    existingImage = await prisma.image.findFirst({
      where: {
        sectionId,
        position,
      }
    });
  }

  if (existingImage) {
    // Update existing slot
    await prisma.image.update({
      where: { id: existingImage.id },
      data: {
        originalUrl: url,
        displayUrl: url,
        thumbUrl: url,
        width: width || 800,
        height: height || 600,
      }
    });
  } else {
    // Create new image in this slot
    await prisma.image.create({
      data: {
        originalUrl: url,
        displayUrl: url,
        thumbUrl: url,
        position,
        sectionId,
        width: width || 800,
        height: height || 600,
      }
    });
  }
}
