export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { getLayoutComponent } from "@/lib/theme-to-layout";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const sections = await prisma.section.findMany({
    where: { userId: session.user.id },
    include: { images: { include: { notes: true } } },
    orderBy: { createdAt: "desc" },
  });

  const handleSignOut = async () => {
    "use server";
    const { signOut } = await import("@/lib/auth");
    await signOut({ redirectTo: "/login" });
  };

  return (
    <div className="min-h-screen px-8 pt-32 pb-16 max-w-7xl mx-auto space-y-24">
      <Navbar signOutAction={handleSignOut} />

      {sections.length === 0 ? (
        <div className="text-center text-muted border-2 border-dashed border-muted/30 p-12 rounded">
          <p>No albums yet. Start archiving your memories!</p>
        </div>
      ) : (
        sections.map((section) => {
          const Layout = getLayoutComponent(section.theme);
          return (
            <section key={section.id} className="space-y-4">
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all hover:bg-white/20 hover:shadow-[0_10px_40px_rgb(0,0,0,0.5)]">
                <div>
                  <h2 className="font-serif italic text-3xl font-semibold text-white drop-shadow-md mb-1 tracking-wide">
                    {section.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white uppercase tracking-widest shadow-sm">
                      {section.theme}
                    </span>
                    <span className="text-sm font-medium text-white/70">
                      • {section.images.length} memories
                    </span>
                  </div>
                </div>
                <Link href={`/section/${section.id}`} className="group flex items-center gap-2 bg-white/20 hover:bg-white/40 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-sm hover:shadow">
                  View & Edit
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              <div className="w-full py-8">
                <Layout images={section.images} />
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
