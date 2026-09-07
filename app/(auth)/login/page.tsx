export const dynamic = "force-dynamic";
import { signIn } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LoginSlideshow from "@/components/LoginSlideshow";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side: Aesthetic Image Slideshow */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <LoginSlideshow />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-20 pointer-events-none">
          <h2 className="font-serif text-5xl font-bold mb-4 drop-shadow-md">Preserve what matters.</h2>
          <p className="text-xl text-gray-200 font-light max-w-md drop-shadow-sm leading-relaxed">
            Your memories deserve more than a hard drive. Build spatial, interactive galleries that bring your photos back to life.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-10">
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Memory Lane
            </h1>
            <p className="text-gray-500 text-lg">
              Sign in to start curating your digital albums.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-0.5 font-medium tracking-wide flex justify-center items-center gap-3 group"
              >
                Continue with Google
                <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
