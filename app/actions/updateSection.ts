"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateSectionTheme(sectionId: string, theme: string, customCssUrl?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const layoutType = 
    theme === "travel" ? "filmstrip" : 
    theme === "everyday" ? "mosaic" : 
    theme === "tunnel" ? "tunnel" : 
    theme === "ribbon" ? "ribbon" : 
    "polaroid";

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section || section.userId !== session.user.id) {
    return { error: "Unauthorized or not found" };
  }

  await prisma.section.update({
    where: { id: sectionId },
    data: { 
      theme, 
      layoutType,
      ...(customCssUrl !== undefined && { customCssUrl }) 
    },
  });

  revalidatePath(`/section/${sectionId}`);
  revalidatePath('/home');

  return { success: true };
}

export async function updateCustomCss(sectionId: string, customCssUrl: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section || section.userId !== session.user.id) {
    return { error: "Unauthorized or not found" };
  }

  await prisma.section.update({
    where: { id: sectionId },
    data: { customCssUrl: customCssUrl || null },
  });

  revalidatePath(`/section/${sectionId}`);
  revalidatePath('/home');

  return { success: true };
}

export async function updateSectionTitle(sectionId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section || section.userId !== session.user.id) {
    return { error: "Unauthorized or not found" };
  }

  await prisma.section.update({
    where: { id: sectionId },
    data: { title },
  });

  revalidatePath(`/section/${sectionId}`);
  revalidatePath('/home');

  return { success: true };
}
