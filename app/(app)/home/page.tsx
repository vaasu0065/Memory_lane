import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { getLayoutComponent } from "@/lib/theme-to-layout";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const sections = await prisma.section.findMany({
    where: { userId: session.user.id },
    include: { images: { include: { notes: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen px-8 pt-32 pb-16 max-w-7xl mx-auto space-y-24">
      <header className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex justify-between items-center bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/20 px-8 py-4 rounded-full">
        <h1 className="font-serif text-3xl font-bold text-white drop-shadow-md">Memory Lane</h1>
        <div className="flex gap-6 items-center">
          <Link href="/section/new" className="bg-white/20 text-white px-6 py-2.5 rounded-full shadow-sm hover:shadow hover:bg-white/30 hover:-translate-y-0.5 transition-all font-medium">
            New Album
          </Link>
          <form action={async () => { "use server"; const { signOut } = await import("@/lib/auth"); await signOut({ redirectTo: "/login" }); }}>
            <button className="text-white/60 hover:text-white font-medium transition-colors">Sign out</button>
          </form>
        </div>
      </header>

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
