"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";

export default function LandingClient({ isLoggedIn, signOutAction }: { isLoggedIn: boolean, signOutAction: () => void }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 overflow-x-hidden flex flex-col">
      {/* Navbar */}
      <nav className="w-[90%] max-w-5xl mx-auto mt-6 z-50 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-8 py-2">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
            Memory Lane
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Our Memory Lanes Created
            </Link>
            {isLoggedIn ? (
              <div className="group relative">
                <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 p-1.5 pr-4 rounded-full transition-all shadow-sm">
                  <div className="w-8 h-8 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center border border-pink-100">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-medium">Profile</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                   <div className="p-2">
                     <form action={signOutAction}>
                       <button type="submit" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                         <LogOut size={16} />
                         Sign out
                       </button>
                     </form>
                   </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32">
        <section className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
            Archive your memories <br />
            <span className="font-serif italic font-normal text-pink-500">in gorgeous layouts.</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Turn your standard photo grids into immersive, highly animated digital scrapbooks and cinematic experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto">
              Start Building Now
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 text-center mt-auto">
        <p className="text-gray-500 font-serif italic">
          Built with love to preserve your memories.
        </p>
      </footer>
    </div>
  );
}
