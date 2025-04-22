import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Role = "admin" | "viewer" | null;

export const useUserRole = (): Role => {
  const [role, setRole] = useState<Role>(null);
  useEffect(() => {
    const fetchRole = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setRole(profile?.role || null);
    };

    fetchRole();
  }, []);

  return role;
};
