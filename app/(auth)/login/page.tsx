export const dynamic = "force-dynamic";
import { signIn } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Subtle glow inside the form card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="font-serif text-4xl font-semibold text-white drop-shadow-md mb-4 text-center tracking-wide">
            Memory Lane
          </h1>
          <p className="text-center text-white/60 mb-10 font-light">
            Sign in to view and curate your digital photo albums.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/home" });
            }}
          >
            <button
              type="submit"
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 backdrop-blur-md transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] font-medium tracking-wide flex justify-center items-center gap-3 group"
            >
              Sign in with Google
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:text-white/90 font-medium hover:underline decoration-white/30 underline-offset-4 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
