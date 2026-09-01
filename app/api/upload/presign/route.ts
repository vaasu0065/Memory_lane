export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getPresignedUrl } from "@/lib/r2";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType } = await req.json();
  const key = `${session.user.id}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const { url } = await getPresignedUrl(key, contentType);

  return NextResponse.json({ url, key });
}
