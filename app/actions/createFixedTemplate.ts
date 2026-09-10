"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createFixedTemplateAction(formData: FormData) {
  const purpose = formData.get("purpose") as string;
  const theme = formData.get("theme") as string; // This is the template id, e.g. "family-classic"
  
  const session = await auth();
  if (!session?.user?.id) return;

  // Set a default title based on purpose
  const title = `My ${purpose.charAt(0).toUpperCase() + purpose.slice(1)} Memory`;

  // Create the section
  const newSection = await prisma.section.create({
    data: {
      title,
      purpose,
      theme,
      layoutType: "fixed", // A new layout type indicator for these templates
      userId: session.user.id,
    }
  });
  
  // Redirect to the fixed-slot editor
  redirect(`/section/${newSection.id}`);
}
