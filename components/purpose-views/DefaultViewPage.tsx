"use client";

import Image from "next/image";

export default function DefaultViewPage({ section }: { section: any }) {
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">{section.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.images?.map((img: any) => (
            <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-md">
              {img.displayUrl && (
                <Image src={img.displayUrl} alt="Album Image" fill className="object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
