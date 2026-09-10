"use client";

import Link from "next/link";
import { User, LogOut, Sun } from "lucide-react";

export default function Navbar({ signOutAction, session }: { signOutAction?: () => void, session?: any }) {
  const isLoggedIn = !!session?.user?.id;
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <Sun size={24} className="text-[#2c241b] fill-[#2c241b]" />
          <span className="font-serif text-2xl font-black tracking-tight text-[#2c241b]">
            Memory Lane
          </span>
        </Link>

        {/* Centered Links */}
        <div className="hidden md:flex items-center gap-8 text-[#5a4d41] font-medium text-sm tracking-wide">
          <Link href="/" className="relative text-[#2c241b] transition-colors">
            Home
            <span className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-[#2c241b]"></span>
          </Link>
          <Link href="/#albums" className="hover:text-[#2c241b] transition-colors">
            Albums
          </Link>
          <Link href="/#map" className="hover:text-[#2c241b] transition-colors">
            Map
          </Link>
          <Link href="/#favorites" className="hover:text-[#2c241b] transition-colors">
            Favorites
          </Link>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="group relative">
              <button className="flex items-center gap-2 text-[#2c241b] p-1 pr-3 rounded-full transition-all duration-300 hover:bg-black/5">
                <div className="w-8 h-8 bg-[#e8e0d5] text-[#5a4d41] rounded-full flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=User&background=e8e0d5&color=5a4d41" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-semibold tracking-wide">Profile</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-[#e8e0d5] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                 <div className="p-2">
                   {signOutAction && (
                     <form action={signOutAction}>
                       <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors">
                         <LogOut size={18} />
                         Sign out securely
                       </button>
                     </form>
                   )}
                 </div>
              </div>
            </div>
          ) : (
            <Link 
              href="/login"
              className="px-6 py-2 bg-[#2c241b] text-white rounded-full text-sm font-semibold tracking-wide hover:bg-[#1a1510] transition-colors shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
