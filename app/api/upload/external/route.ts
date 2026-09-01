import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, sectionId, width, height } = await req.json();

    if (!url || !sectionId) {
      return NextResponse.json({ error: "Missing url or sectionId" }, { status: 400 });
    }

    // Verify section ownership
    const section = await prisma.section.findUnique({
      where: { id: sectionId, userId: session.user.id },
    });

    if (!section) {
      return NextResponse.json({ error: "Section not found or unauthorized" }, { status: 403 });
    }

    // Save directly to the DB. For external URLs, we use the same URL for original, display, and thumb
    const image = await prisma.image.create({
      data: {
        sectionId,
        originalUrl: url,
        displayUrl: url,
        thumbUrl: url,
        width: width || 800, // fallback if not provided
        height: height || 600, // fallback if not provided
        position: 0, // Should calculate max position if we cared about order
      },
    });

    return NextResponse.json({ image });
  } catch (error: any) {
    console.error("External upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
