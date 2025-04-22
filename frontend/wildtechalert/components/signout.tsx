// components/SignOutButton.tsx
"use client";
import { createClient } from "@/lib/supabase/server";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    router.refresh(); // Clear client-side cache
    router.push("/login"); // Redirect to login
  };

  return (
    <Button onClick={handleSignOut} variant="destructive">
      Sign Out
    </Button>
  );
}
