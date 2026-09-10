"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateSectionDetails } from "@/app/actions/updateSection";
import SlotUploader from "./SlotUploader";
import FamilyClassicLayout from "./purpose-views/FamilyClassicLayout";
import FamilyMosaicLayout from "./purpose-views/FamilyMosaicLayout";
import Link from "next/link";
import { ChevronLeft, Share } from "lucide-react";

interface FixedSlotEditorProps {
  section: any;
}

export default function FixedSlotEditor({ section }: FixedSlotEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(section.title || "");
  const [description, setDescription] = useState(section.description || "");
  
  // Parse existing content JSON safely
  const initialContent = typeof section.content === 'string' ? JSON.parse(section.content) : (section.content || {});
  const [content, setContent] = useState<any>(initialContent);
  
  const [isPending, startTransition] = useTransition();

  const handleUploadComplete = () => {
    router.refresh();
  };

  const handleSaveText = (newTitle: string = title, newDesc: string = description, newContent: any = content) => {
    startTransition(async () => {
      await updateSectionDetails(section.id, newTitle, newDesc, newContent);
      router.refresh();
    });
  };

  const handleContentChange = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    handleSaveText(title, description, newContent);
  };

  // Determine configuration based on theme
  let LayoutComponent = null;
  let slotsConfig: { label: string, allowMultiple?: boolean, maxFiles?: number, dbPosition: number }[] = [];

  if (section.theme === "family-classic" || section.theme === "ribbon") {
    LayoutComponent = FamilyClassicLayout;
    slotsConfig = [
      { label: "Hero Background Slideshow", allowMultiple: true, maxFiles: 6, dbPosition: 0 },
      { label: "Animated Photo Ribbon", allowMultiple: true, maxFiles: 20, dbPosition: 1 },
      { label: "Interactive Scrapbook", allowMultiple: true, maxFiles: 20, dbPosition: 3 },
      { label: "Floating 3D Parallax Stack", allowMultiple: true, maxFiles: 15, dbPosition: 4 },
    ];
  } else if (section.theme === "family-mosaic" || section.theme === "everyday") {
    LayoutComponent = FamilyMosaicLayout;
    slotsConfig = [
      { label: "Large Horizontal (Top)", dbPosition: 0 },
      { label: "Small Square 1", dbPosition: 1 },
      { label: "Small Square 2", dbPosition: 2 },
      { label: "Tall Vertical (Right)", dbPosition: 3 },
      { label: "Large Horizontal (Middle)", dbPosition: 4 },
      { label: "Small Square 3", dbPosition: 5 },
      { label: "Tall Vertical (Left)", dbPosition: 6 },
      { label: "Small Square 4", dbPosition: 7 },
    ];
  }

  if (!LayoutComponent) {
    return <div className="p-8 text-center">Unsupported template.</div>;
  }

  // Ensure images are sorted by position and upload time
  const sortedImages = [...(section.images || [])].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
  });

  // Map images by position as arrays for slots that allow multiple
  const imagesByPosition = sortedImages.reduce((acc: Record<number, any[]>, img) => {
    if (!acc[img.position]) acc[img.position] = [];
    acc[img.position].push(img);
    return acc;
  }, {});

  // The Layout expects an array where index matches the slot.
  // For single-image slots, it passes the single image. For multiple, it passes the array.
  const layoutImages = slotsConfig.map((slot) => {
    const imagesForSlot = imagesByPosition[slot.dbPosition] || [];
    return slot.allowMultiple ? imagesForSlot : (imagesForSlot[0] || null);
  });

  const completedSlots = slotsConfig.filter((slot) => (imagesByPosition[slot.dbPosition] || []).length > 0).length;
  const totalSlots = slotsConfig.length;
  const progress = Math.round((completedSlots / totalSlots) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* LEFT: The Editor Panel */}
      <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0 flex flex-col shadow-2xl z-20">
        
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6 transition-colors">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Album Heading</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleSaveText()}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-black outline-none bg-transparent font-serif text-2xl font-bold text-gray-900 transition-colors"
                placeholder="My Family Memory"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Album Description & Notes</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleSaveText()}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-black outline-none bg-transparent text-sm text-gray-600 resize-none transition-colors"
                placeholder="These are some of my favorite moments..."
                rows={3}
              />
              {isPending && <span className="text-xs text-indigo-500 font-semibold mt-1 block animate-pulse">Saving...</span>}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-6 font-medium">Upload photos to the specific slots below to construct your page.</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
            <span>{completedSlots} of {totalSlots}</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="p-6 space-y-4 flex-1">
          {slotsConfig.map((slot, index) => {
            const images = imagesByPosition[slot.dbPosition] || [];
            return (
              <SlotUploader 
                key={slot.dbPosition}
                sectionId={section.id}
                position={slot.dbPosition}
                label={slot.label}
                currentImageUrl={images[0]?.displayUrl}
                allowMultiple={slot.allowMultiple}
                maxFiles={slot.maxFiles}
                imageCount={images.length}
                onUploadComplete={handleUploadComplete}
              />
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0">
          <Link 
            href={`/share/${section.shareSlug || section.id}`}
            target="_blank"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md transition-all"
          >
            <Share size={18} /> View Final Page
          </Link>
        </div>
      </div>

      {/* RIGHT: Live Preview (Scaled Down to fit) */}
      <div className="flex-1 h-screen overflow-y-auto bg-[#fdfbf7] relative">
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md">
          Live Preview
        </div>
        
        {/* We render the actual layout. It will consume the images we pass it. */}
        <div className="w-full h-full">
          <LayoutComponent 
            images={sortedImages} 
            title={title} 
            description={description} 
            content={content}
            onTitleChange={(newTitle: string) => {
              setTitle(newTitle);
              handleSaveText(newTitle, description, content);
            }}
            onDescriptionChange={(newDescription: string) => {
              setDescription(newDescription);
              handleSaveText(title, newDescription, content);
            }}
            onContentChange={handleContentChange}
          />
        </div>
      </div>

    </div>
  );
}
