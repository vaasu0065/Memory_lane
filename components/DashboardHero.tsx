import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardHero() {
  return (
    <section className="relative w-full pt-12 pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
      {/* Left Column: Typography & Call to Action */}
      <div className="flex-1 w-full flex flex-col items-start z-10">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#8a755b] mb-6">
          Welcome Back
        </span>
        
        <h1 className="font-serif text-6xl md:text-[6rem] lg:text-[7rem] font-bold text-[#1c1917] leading-[0.9] tracking-tighter flex flex-col mb-6">
          <span>Your</span>
          <span>Memory Lanes</span>
        </h1>

        <p className="font-handwriting text-3xl md:text-5xl text-[#2c241b] mb-8 mt-2 -rotate-2">
          Collect moments. Relive emotions.<br />Forever yours.
        </p>

        <p className="text-[#5a4d41] text-base leading-relaxed max-w-md font-medium mb-10">
          Turn your photos into beautiful stories with cinematic slideshows, interactive maps, and so much more.
        </p>

        <Link 
          href="#create" 
          className="group inline-flex items-center gap-3 bg-[#1c1917] hover:bg-[#3d3329] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
        >
          Start a New Memory Lane
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Right Column: Polaroid Composition */}
      <div className="flex-1 w-full relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center lg:justify-end pr-0 lg:pr-12 pointer-events-none">
        
        {/* Background decorative shadows/glows */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[#d9cbb8]/30 blur-[100px] rounded-full"></div>

        {/* Polaroid 1 (Left/Back) */}
        <div className="absolute left-[0%] lg:left-[10%] top-[20%] w-64 md:w-72 bg-[#fdfbf7] p-4 pb-16 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm -rotate-12 transition-transform duration-700 hover:-translate-y-4 hover:rotate-[-8deg] z-10 pointer-events-auto cursor-pointer">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-200">
            <Image 
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800" 
              alt="Family" 
              fill 
              className="object-cover"
            />
          </div>
          {/* Decorative handwriting overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-handwriting text-2xl text-[#2c241b]/80 whitespace-nowrap -rotate-2">
            Good Memories
          </div>
        </div>

        {/* Polaroid 2 (Center/Front) */}
        <div className="absolute left-[25%] lg:left-[35%] top-[10%] w-72 md:w-80 bg-[#fdfbf7] p-4 pb-20 shadow-[0_30px_60px_rgba(0,0,0,0.2)] rounded-sm rotate-3 transition-transform duration-700 hover:-translate-y-6 hover:rotate-0 z-30 pointer-events-auto cursor-pointer">
          {/* Tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 backdrop-blur-md rotate-2 shadow-sm border border-white/20 z-10"></div>
          
          <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
            <Image 
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800" 
              alt="Travel" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-handwriting text-3xl text-[#2c241b]/90 whitespace-nowrap -rotate-3">
            Just Moments ♡
          </div>
        </div>

        {/* Polaroid 3 (Right/Mid) */}
        <div className="absolute right-[0%] lg:right-[-5%] top-[15%] w-60 md:w-64 bg-[#fdfbf7] p-4 pb-16 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-sm rotate-12 transition-transform duration-700 hover:-translate-y-4 hover:rotate-[8deg] z-20 pointer-events-auto cursor-pointer">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-200">
            <Image 
              src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=800" 
              alt="Landscape" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-handwriting text-2xl text-[#2c241b]/80 whitespace-nowrap text-center leading-tight">
            Same People<br/>Brighter Days
          </div>
        </div>

        {/* Floating Decorative Elements (Mimicking Dried Flowers/Torn Paper) */}
        <div className="absolute top-[40%] left-[5%] w-24 h-32 opacity-80 mix-blend-multiply rotate-[-15deg] pointer-events-none z-0">
           <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/floral-pattern.png')] opacity-30 rounded-full blur-[2px]"></div>
        </div>
        
        <div className="absolute bottom-[5%] right-[0%] w-32 h-40 bg-[#f4ebd8] shadow-sm rotate-[10deg] border border-[#e5d5be] p-4 flex flex-col justify-center items-center z-40 pointer-events-none">
          <div className="font-handwriting text-[#5a4d41] text-xl leading-snug text-center -rotate-[5deg]">
            New<br/>Stories<br/>Await ♡
          </div>
        </div>

      </div>
    </section>
  );
}
