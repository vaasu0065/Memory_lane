export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCloudinarySignature } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sectionId } = await req.json();
  
  if (!sectionId) {
    return NextResponse.json({ error: "Missing sectionId" }, { status: 400 });
  }

  try {
    // We organize uploads into a specific folder on Cloudinary
    const folder = `memory_lane/${sectionId}`;
    const signData = getCloudinarySignature(folder);
    
    return NextResponse.json({ ...signData, folder });
  } catch (err) {
    console.error("Cloudinary sign error:", err);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
