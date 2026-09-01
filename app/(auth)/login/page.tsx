export const dynamic = "force-dynamic";
import { signIn } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-paper border border-muted p-8 rounded shadow-[4px_4px_0px_0px_#A9A08C]">
        <h1 className="font-serif text-3xl font-bold text-ink mb-6 text-center">
          Memory Lane
        </h1>
        <p className="text-center text-muted mb-8">
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
            className="w-full bg-accent text-paper py-3 px-4 rounded font-medium hover:bg-opacity-90 transition-opacity flex justify-center items-center gap-2"
          >
            Sign in with Google
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
