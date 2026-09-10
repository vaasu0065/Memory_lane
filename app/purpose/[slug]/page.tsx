import { notFound } from "next/navigation";
import { createFixedTemplateAction } from "@/app/actions/createFixedTemplate";
import FamilyClassicLayout from "@/components/purpose-views/FamilyClassicLayout";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Temporary mapping for purpose defaults
const PURPOSE_DEFAULTS: Record<string, { theme: string, Layout: any, label: string }> = {
  family: {
    theme: "family-classic",
    Layout: FamilyClassicLayout,
    label: "Family"
  }
};

export default function PurposeHubPage({ params }: { params: { slug: string } }) {
  const config = PURPOSE_DEFAULTS[params.slug];
  if (!config) notFound();

  const { Layout, label, theme } = config;

  return (
    <div className="relative bg-[#fdfbf7] min-h-screen">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-start pointer-events-none">
        <Link 
          href="/dashboard" 
          className="pointer-events-auto bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-semibold hover:bg-white transition-all text-gray-700"
        >
          <ChevronLeft size={16} /> Dashboard
        </Link>
      </nav>

      {/* 
        The Fixed CTA Overlay 
        This is what the user clicks to actually create their album after viewing the default animations
      */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white/80 to-transparent z-50 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full text-center flex flex-col items-center gap-4 animate-in slide-in-from-bottom-10 duration-700 delay-500">
          <div>
            <h3 className="font-serif font-bold text-xl text-gray-900">Make this your own</h3>
            <p className="text-sm text-gray-500 mt-1">Swap these placeholder images with your own memories.</p>
          </div>
          
          <form action={createFixedTemplateAction} className="w-full">
            <input type="hidden" name="purpose" value={params.slug} />
            <input type="hidden" name="theme" value={theme} />
            <button 
              type="submit"
              className="w-full bg-[#2c241b] text-white py-3 rounded-xl font-bold shadow-md hover:bg-black transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Create My {label} Album
            </button>
          </form>
        </div>
      </div>

      {/* Render the default beautiful layout with empty images (which triggers the gorgeous placeholders we set up) */}
      <Layout images={[]} />
    </div>
  );
}
