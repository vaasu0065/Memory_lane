"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";

export default function Navbar({ signOutAction }: { signOutAction: () => void }) {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-8 py-2">
      <div className="h-16 flex items-center justify-between">
        <Link href="/home" className="font-serif text-2xl font-bold tracking-tight text-gray-900">
          Memory Lane
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/section/new" 
            className="hidden md:block text-sm font-medium text-slate-600 hover:text-indigo-900 transition-colors"
          >
            New Album
          </Link>
          <div className="group relative">
            <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 p-1.5 pr-4 rounded-full transition-all shadow-sm hover:shadow-md">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
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
        </div>
      </div>
    </nav>
  );
}
