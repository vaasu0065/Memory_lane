"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar({ signOutAction }: { signOutAction: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down past 50px, hide the navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // If we scroll up, show it again
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 flex justify-between items-center bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/20 px-8 py-4 rounded-full transition-all duration-500 ease-in-out ${
        isVisible ? "top-8 opacity-100" : "-top-24 opacity-0 pointer-events-none"
      }`}
    >
      <Link href="/home" className="font-serif text-3xl font-bold text-white drop-shadow-md">
        Memory Lane
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/section/new" className="bg-white/20 text-white px-6 py-2.5 rounded-full shadow-sm hover:shadow hover:bg-white/30 hover:-translate-y-0.5 transition-all font-medium">
          New Album
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="text-white/60 hover:text-white font-medium transition-colors">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
