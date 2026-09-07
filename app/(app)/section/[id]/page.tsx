export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getLayoutComponent } from "@/lib/theme-to-layout";
import UploadDropzone from "@/components/UploadDropzone";
import TemplateSelector from "@/components/TemplateSelector";
import DeleteSectionButton from "@/components/DeleteSectionButton";
import EditableTitle from "@/components/EditableTitle";
import ManageImagesGrid from "@/components/ManageImagesGrid";
import CreateAlbumForm from "@/components/CreateAlbumForm";
import ScrapbookEditor from "@/components/ScrapbookEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SectionPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (params.id === "new") {
    return <CreateAlbumForm />;
  }

  const section = await prisma.section.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: { 
      images: { include: { notes: true }, orderBy: { uploadedAt: "asc" } },
      stickyNotes: true,
    },
  });

  if (!section) notFound();

  const Layout = getLayoutComponent(section.theme);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      {(section as any).customCssUrl && (
        <link rel="stylesheet" href={(section as any).customCssUrl} />
      )}

      <div className="mb-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 shadow-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-center bg-white backdrop-blur-md border border-gray-200 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative overflow-hidden album-header-container">
          {/* Subtle glow inside the box */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none album-header-glow"></div>
          
          <div className="relative z-10">
            <EditableTitle sectionId={section.id} initialTitle={section.title} />
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold text-gray-900 uppercase tracking-widest shadow-sm album-theme-badge">
                {section.purpose && section.purpose !== "other" ? section.purpose : section.theme}
              </span>
              <span className="text-sm font-medium text-gray-700 album-stats">
                • {section.images.length} memories collected
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <Link href={`/share/${section.shareSlug || section.id}`} className="group flex items-center gap-2 bg-white shadow-sm hover:bg-gray-100 shadow-sm text-gray-900 px-6 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow album-share-btn">
              View Public Share Link
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <DeleteSectionButton sectionId={section.id} />
          </div>
        </div>
      </div>

      <TemplateSelector sectionId={section.id} currentTheme={section.theme} currentCustomCssUrl={(section as any).customCssUrl} purpose={section.purpose} />

      <div className="mb-12">
        <UploadDropzone sectionId={section.id} />
        {section.images.length > 0 && <ManageImagesGrid images={section.images} />}
      </div>

      {section.images.length > 0 && (
        <div className="w-full py-8 relative">
          {section.theme === "scrapbook" ? (
            <ScrapbookEditor
              images={section.images}
              stickyNotes={section.stickyNotes}
              sectionId={section.id}
              albumTitle={section.title}
              albumPurpose={section.purpose || undefined}
            />
          ) : (
            <Layout 
              images={section.images} 
              albumTitle={section.title}
              albumPurpose={section.purpose || undefined}
            />
          )}
        </div>
      )}
    </div>
  );
}
