"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createSectionAction(formData: FormData) {
  const title = formData.get("title") as string;
  const theme = formData.get("theme") as string;
  const purpose = formData.get("purpose") as string;
  const description = formData.get("description") as string;
  
  const session = await auth();
  if (!session?.user?.id) return;

  const layoutType = 
    theme === "travel" ? "filmstrip" : 
    theme === "everyday" ? "mosaic" : 
    theme === "tunnel" ? "tunnel" : 
    theme === "ribbon" ? "ribbon" : 
    theme === "carousel" ? "carousel" :
    "polaroid";

  const newSection = await prisma.section.create({
    data: {
      title,
      theme,
      purpose,
      description,
      layoutType,
      userId: session.user.id,
    }
  });
  
  redirect(`/section/${newSection.id}`);
}
