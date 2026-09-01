export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  try {
    const data = await req.arrayBuffer();
    const buffer = Buffer.from(data);
    
    // Save to public/uploads folder so it can be served statically
    const filePath = join(process.cwd(), "public", "uploads", key);
    
    // Ensure directory exists
    await mkdir(dirname(filePath), { recursive: true });
    
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("Mock upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
