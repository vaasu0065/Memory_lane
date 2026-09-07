"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Landing3DShowcase, { mockPrismaImages } from "@/components/Landing3DShowcase";
import { Layers, Cuboid as Cube, Share2, PenLine, User, LogOut } from "lucide-react";
import TunnelGridLayout from "@/components/layouts/TunnelGridLayout";
import PolaroidPileLayout from "@/components/layouts/PolaroidPileLayout";
import TwistedFilmstrip from "@/components/layouts/3d/TwistedFilmstrip";

export default function LandingClient({ isLoggedIn, signOutAction }: { isLoggedIn: boolean, signOutAction: () => void }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 selection:bg-pink-100 overflow-x-hidden">
      {/* Top Mask to hide scrolling text above the pill */}
      <div className="fixed top-0 inset-x-0 h-16 bg-gradient-to-b from-[#F9FAFB] via-[#F9FAFB] to-transparent z-40 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm rounded-full px-8 py-2">
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

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8"
          >
            Archive your memories <br />
            <span className="font-serif italic font-normal text-pink-500">in gorgeous 3D.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Don't just store your photos in flat grids. Turn them into interactive 3D galleries, polaroid piles, and cinematic filmstrips.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto">
              Start Building Now
            </Link>
            <a href="#features" className="bg-white text-gray-900 px-8 py-4 rounded-full font-medium text-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all w-full sm:w-auto">
              Explore Features
            </a>
          </motion.div>
        </section>

        {/* 3D Showcase */}
        <section className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <Landing3DShowcase />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Designed for Nostalgia</h2>
            <p className="text-xl text-gray-600 font-serif italic max-w-2xl mx-auto">
              Every feature is built to make your digital photos feel tangible and physical again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Cube className="w-8 h-8 text-pink-500" />}
              title="3D Layouts"
              description="Choose from a variety of immersive 3D templates like the Tunnel Grid, Carousel, and Ribbon Loop."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Layers className="w-8 h-8 text-pink-500" />}
              title="Physical Physics"
              description="Toss your photos around in the Polaroid Pile layout with real gravity and drag physics."
              delay={0.2}
            />
            <FeatureCard 
              icon={<PenLine className="w-8 h-8 text-pink-500" />}
              title="Write on the Back"
              description="Click any photo to physically flip it over in 3D and write your memories on the back of the card."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Share2 className="w-8 h-8 text-pink-500" />}
              title="Public Sharing"
              description="Generate a beautiful, read-only public link to share your specific albums with friends and family."
              delay={0.4}
            />
          </div>
        </section>

        {/* Templates Showcase Section */}
        <section className="bg-white py-32 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Explore the Templates</h2>
              <p className="text-xl text-gray-600 font-serif italic max-w-2xl mx-auto">
                Turn standard photo grids into unforgettable spatial experiences.
              </p>
            </div>

            <div className="space-y-32">
              {/* Template 1 */}
              <div className="flex flex-col md:flex-row items-center gap-16">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full md:w-1/2"
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border border-gray-200">
                    <TunnelGridLayout images={mockPrismaImages} previewMode={true} />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="w-full md:w-1/2 space-y-6"
                >
                  <div className="inline-block px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-sm font-bold text-pink-600 uppercase tracking-widest">
                    The Infinite Tunnel
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">Fly through your memories.</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Experience your photos like never before. The Tunnel template wraps your images into an infinite, glowing 3D cylinder that you can endlessly scroll through. Perfect for large travel albums or yearly reviews.
                  </p>
                </motion.div>
              </div>

              {/* Template 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full md:w-1/2"
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border border-gray-200 bg-gray-50 flex items-center justify-center p-4">
                    <PolaroidPileLayout images={mockPrismaImages} previewMode={true} />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="w-full md:w-1/2 space-y-6"
                >
                  <div className="inline-block px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-sm font-bold text-pink-600 uppercase tracking-widest">
                    The Polaroid Pile
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">Messy, tangible, and fun.</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Toss your photos onto a digital desk. Real drag-and-drop physics let you shuffle, toss, and stack your polaroids. Click any photo to flip it over and read the handwritten notes on the back!
                  </p>
                </motion.div>
              </div>

              {/* Template 3 */}
              <div className="flex flex-col md:flex-row items-center gap-16">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full md:w-1/2"
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border border-gray-200">
                    <div className="absolute inset-0 z-10 bg-transparent pointer-events-none" /> {/* Prevents scrolling the page when trying to interact with canvas */}
                    <TwistedFilmstrip images={mockPrismaImages} previewMode={true} />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="w-full md:w-1/2 space-y-6"
                >
                  <div className="inline-block px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-sm font-bold text-pink-600 uppercase tracking-widest">
                    The Cinematic Ribbon
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">Your life, like a movie.</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Render your gallery as a twisting, looping 3D filmstrip floating in space. A cinematic approach to showcasing sequential events like weddings, parties, or weekend getaways.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center">
        <p className="text-gray-500 font-serif italic">
          Built with love to preserve your memories.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
    >
      <div className="bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
