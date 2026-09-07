import LandingClient from "./LandingClient";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();
  
  const handleSignOut = async () => {
    "use server";
    const { signOut } = await import("@/lib/auth");
    await signOut({ redirectTo: "/home" });
  };

  return (
    <LandingClient 
      isLoggedIn={!!session?.user} 
      signOutAction={handleSignOut} 
    />
  );
}
