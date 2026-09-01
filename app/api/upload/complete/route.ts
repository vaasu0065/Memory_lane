export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/r2";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key, sectionId } = await req.json();

  // In a real implementation with R2, we'd fetch the file from R2 using the key,
  // process it with sharp (resize for display and thumb, extract EXIF),
  // and upload the smaller versions back to R2.
  // Then we save the URLs to the DB.

  // For this mock implementation without credentials:
  const originalUrl = getPublicUrl(key);
  
  // We'll just use the same URL for all sizes for the mock
  const displayUrl = originalUrl;
  const thumbUrl = originalUrl;
  
  // Mock dimensions and date
  const width = 1600;
  const height = 1200;
  const takenAt = new Date();

  // Get current position (count of images in section)
  const count = await prisma.image.count({ where: { sectionId } });

  const image = await prisma.image.create({
    data: {
      sectionId,
      originalUrl,
      displayUrl,
      thumbUrl,
      takenAt,
      width,
      height,
      position: count,
    },
  });

  return NextResponse.json(image);
}
