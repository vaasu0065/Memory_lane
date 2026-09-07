export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeAlbumList from "@/components/HomeAlbumList";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const sections = await prisma.section.findMany({
    where: { userId: session.user.id },
    include: { 
      images: { include: { notes: true } },
      stickyNotes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const handleSignOut = async () => {
    "use server";
    const { signOut } = await import("@/lib/auth");
    await signOut({ redirectTo: "/home" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/50 text-slate-900 selection:bg-indigo-200">
      <Navbar signOutAction={handleSignOut} />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-16 space-y-12">
        <div className="flex justify-between items-end">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-950 drop-shadow-sm">
            Your Memory Lanes
          </h1>
        </div>

        <HomeAlbumList sections={sections} />
      </main>
    </div>
  );
}
