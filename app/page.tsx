export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeAlbumList from "@/components/HomeAlbumList";
import DashboardPurposeSelector from "@/components/DashboardPurposeSelector";
import DashboardHero from "@/components/DashboardHero";
import DashboardFooterBanner from "@/components/DashboardFooterBanner";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  // Artificial delay to show off the beautiful custom loader screen
  await new Promise((resolve) => setTimeout(resolve, 3000));

  let sections: any[] = [];
  if (isLoggedIn) {
    sections = await prisma.section.findMany({
      where: { userId: session!.user!.id! },
      include: { 
        images: { include: { notes: true } },
        stickyNotes: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  const handleSignOut = async () => {
    "use server";
    const { signOut } = await import("@/lib/auth");
    await signOut({ redirectTo: "/" });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] text-[#1c1917] selection:bg-[#d9cbb8]/50 relative overflow-hidden">
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top left squiggle */}
        <svg className="absolute top-32 left-10 w-24 h-24 text-[#cbb59c] -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10,50 Q25,10 40,50 T70,50 T95,30" />
        </svg>
        
        {/* Top right stars */}
        <svg className="absolute top-48 right-16 w-16 h-16 text-[#cbb59c] rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50,10 L60,40 L90,50 L60,60 L50,90 L40,60 L10,50 L40,40 Z" />
          <path d="M20,20 L25,30 L35,35 L25,40 L20,50 L15,40 L5,35 L15,30 Z" className="scale-50 origin-center translate-x-8 -translate-y-8" />
        </svg>

        {/* Mid left heart */}
        <svg className="absolute top-[35%] left-8 w-20 h-20 text-[#cbb59c] -rotate-12 opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50,85 C50,85 15,55 15,35 C15,20 30,15 40,25 C50,35 50,35 50,35 C50,35 50,35 60,25 C70,15 85,20 85,35 C85,55 50,85 50,85 Z" />
        </svg>

        {/* Center Right Camera */}
        <svg className="absolute top-[30%] right-[30%] w-20 h-20 text-[#cbb59c] rotate-[15deg] opacity-70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="20" y="35" width="60" height="45" rx="5" />
          <circle cx="50" cy="57" r="12" />
          <path d="M35,35 L40,25 L60,25 L65,35" />
          <circle cx="70" cy="45" r="2" fill="currentColor" />
        </svg>

        {/* Lower Left Polaroid/Photo Frame */}
        <svg className="absolute top-[65%] left-[20%] w-24 h-24 text-[#cbb59c] -rotate-[10deg] opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="20" y="15" width="60" height="70" rx="2" />
          <rect x="28" y="23" width="44" height="44" />
          <path d="M28,60 L45,45 L55,55 L65,45 L72,55" />
        </svg>

        {/* Bottom Right Map Pin & Path */}
        <svg className="absolute top-[75%] right-20 w-28 h-28 text-[#cbb59c] rotate-[5deg] opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50,20 C35,20 25,30 25,45 C25,65 50,90 50,90 C50,90 75,65 75,45 C75,30 65,20 50,20 Z" />
          <circle cx="50" cy="42" r="8" />
          <path d="M10,90 Q30,70 50,90 T90,80" strokeDasharray="4 4" />
        </svg>

        {/* Far Right Envelope/Letter */}
        <svg className="absolute top-[55%] right-8 w-20 h-20 text-[#cbb59c] -rotate-[20deg] opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="15" y="30" width="70" height="45" rx="3" />
          <path d="M15,30 L50,55 L85,30" />
        </svg>

        {/* --- NEW DOODLES (Middle & Random Areas) --- */}

        {/* Top Middle Music Notes */}
        <svg className="absolute top-[20%] left-[45%] w-16 h-16 text-[#cbb59c] rotate-[10deg] opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30,70 L30,20 L80,10 L80,60" />
          <path d="M30,35 L80,25" />
          <circle cx="20" cy="70" r="10" fill="currentColor" />
          <circle cx="70" cy="60" r="10" fill="currentColor" />
        </svg>

        {/* Middle Left Coffee Cup */}
        <svg className="absolute top-[45%] left-[10%] w-20 h-20 text-[#cbb59c] -rotate-6 opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20,30 L70,30 L65,70 C65,80 55,85 45,85 C35,85 25,80 25,70 Z" />
          <path d="M70,40 C85,40 85,60 70,60" />
          <path d="M35,20 C35,10 45,15 45,5" opacity="0.6" />
          <path d="M55,20 C55,10 65,15 65,5" opacity="0.6" />
        </svg>

        {/* Middle Right Paper Plane */}
        <svg className="absolute top-[50%] right-[15%] w-24 h-24 text-[#cbb59c] rotate-[25deg] opacity-70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10,50 L90,10 L50,90 L40,60 Z" />
          <path d="M90,10 L40,60 L30,80" />
          <path d="M10,80 Q20,70 30,80 T50,70" strokeDasharray="3 3" />
        </svg>

        {/* Bottom Middle Leaf/Branch */}
        <svg className="absolute top-[85%] left-[45%] w-28 h-28 text-[#cbb59c] -rotate-[15deg] opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20,80 Q50,50 80,20" />
          <path d="M40,60 C40,40 20,40 20,60 C20,80 40,80 40,60 Z" />
          <path d="M60,40 C60,20 40,20 40,40 C40,60 60,60 60,40 Z" />
          <path d="M50,70 C50,50 30,50 30,70 C30,90 50,90 50,70 Z" />
          <path d="M70,50 C70,30 50,30 50,50 C50,70 70,70 70,50 Z" />
        </svg>

        {/* Top Center Hourglass */}
        <svg className="absolute top-[10%] left-[60%] w-16 h-16 text-[#cbb59c] rotate-[5deg] opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30,10 L70,10 L70,20 L55,45 L70,70 L70,80 L30,80 L30,70 L45,45 L30,20 Z" />
          <path d="M35,20 L65,20" />
          <path d="M35,70 L65,70" />
          <path d="M45,45 L50,80" strokeDasharray="2 2" />
        </svg>

        {/* Middle Center Ticket */}
        <svg className="absolute top-[40%] left-[55%] w-24 h-24 text-[#cbb59c] -rotate-[8deg] opacity-50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20,30 L80,30 L80,70 L20,70 Z" />
          <path d="M20,45 C30,45 30,55 20,55" />
          <path d="M80,45 C70,45 70,55 80,55" />
          <path d="M40,30 L40,70" strokeDasharray="4 4" opacity="0.5" />
          <circle cx="30" cy="50" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="70" cy="50" r="3" fill="currentColor" opacity="0.5" />
        </svg>

        {/* Bottom left dashes */}
        <svg className="absolute bottom-[10%] left-10 w-32 h-32 text-[#cbb59c] -rotate-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 15">
          <path d="M10,50 C30,20 70,80 90,50" />
        </svg>
      </div>

      <Navbar signOutAction={handleSignOut} session={session} />

      <main className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-32 pb-16 space-y-12">
        <DashboardHero isLoggedIn={isLoggedIn} />

        <DashboardPurposeSelector isLoggedIn={isLoggedIn} />

        {isLoggedIn && (
            <HomeAlbumList sections={sections} />
        )}

        <DashboardFooterBanner />
      </main>
    </div>
  );
}
