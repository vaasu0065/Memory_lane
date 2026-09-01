export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getLayoutComponent } from "@/lib/theme-to-layout";
import UploadDropzone from "@/components/UploadDropzone";
import TemplateSelector from "@/components/TemplateSelector";
import DeleteSectionButton from "@/components/DeleteSectionButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SectionPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (params.id === "new") {
    // Basic form to create a new section
    return (
      <div className="max-w-2xl mx-auto p-10 mt-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative overflow-hidden">
        {/* Subtle glow inside the form card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="font-serif italic text-4xl font-semibold text-white drop-shadow-md mb-8 tracking-wide">Create New Album</h1>
          <form action={async (data) => {
            "use server";
            const title = data.get("title") as string;
            const theme = data.get("theme") as string;
            const { auth } = await import("@/lib/auth");
            const session = await auth();
            if (!session?.user?.id) return;
            const newSection = await prisma.section.create({
              data: {
                title,
                theme,
                layoutType: theme === "travel" ? "filmstrip" : 
                            theme === "everyday" ? "mosaic" : 
                            theme === "tunnel" ? "tunnel" : 
                            theme === "ribbon" ? "ribbon" : 
                            "polaroid",
                userId: session.user.id,
              }
            });
            const { redirect } = await import("next/navigation");
            redirect(`/section/${newSection.id}`);
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">Album Title</label>
              <input type="text" name="title" required placeholder="e.g. Summer Vacation 2026" className="w-full p-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all shadow-inner" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">Starting Theme</label>
              <select name="theme" className="w-full p-4 rounded-xl border border-white/20 bg-black/40 text-white focus:outline-none focus:border-white/60 focus:bg-black/60 transition-all shadow-inner appearance-none cursor-pointer">
                <option value="everyday">Everyday (Mosaic Layout)</option>
                <option value="travel">Travel (Filmstrip Layout)</option>
                <option value="event">Event/Birthday (Polaroid Pile Layout)</option>
                <option value="tunnel">3D Tunnel Grid</option>
                <option value="ribbon">Ribbon Loop (Wavy)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-sm border border-white/30 hover:shadow-lg mt-8">
              Create Album
            </button>
          </form>
        </div>
      </div>
    );
  }

  const section = await prisma.section.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: { images: { include: { notes: true }, orderBy: { uploadedAt: "asc" } } },
  });

  if (!section) notFound();

  const Layout = getLayoutComponent(section.theme);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      {(section as any).customCssUrl && (
        <link rel="stylesheet" href={(section as any).customCssUrl} />
      )}

      <div className="mb-12">
        <Link href="/home" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative overflow-hidden album-header-container">
          {/* Subtle glow inside the box */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none album-header-glow"></div>
          
          <div className="relative z-10">
            <h1 className="font-serif italic text-5xl font-semibold text-white drop-shadow-md mb-3 tracking-wide album-title">
              {section.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-bold text-white uppercase tracking-widest shadow-sm album-theme-badge">
                {section.theme}
              </span>
              <span className="text-sm font-medium text-white/70 album-stats">
                • {section.images.length} memories collected
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <Link href={`/share/${section.shareSlug || section.id}`} className="group flex items-center gap-2 bg-white/20 hover:bg-white/40 text-white px-6 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow album-share-btn">
              View Public Share Link
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <DeleteSectionButton sectionId={section.id} />
          </div>
        </div>
      </div>

      <TemplateSelector sectionId={section.id} currentTheme={section.theme} currentCustomCssUrl={(section as any).customCssUrl} />

      <div className="mb-12">
        <UploadDropzone sectionId={section.id} />
      </div>

      {section.images.length > 0 && (
        <div className="w-full py-8 relative">
          <Layout images={section.images} />
        </div>
      )}
    </div>
  );
}
