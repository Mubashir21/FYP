"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProfileColumns } from "./columns";
import { Profile } from "@/lib/definitions";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";
import AccountApprovalTable from "./table";

export default function RealTimeAccountApprovalTable({
  initialProfiles,
}: {
  initialProfiles: Profile[];
}) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const supabase = createClient();

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload: RealtimePostgresChangesPayload<Profile>) => {
          // Handle different event types
          if (payload.eventType === "INSERT") {
            const newProfile = payload.new as Profile;

            setProfiles((current) => [...current, newProfile]);

            toast.success("New account request!", {
              description: `From: ${newProfile.email || "Unknown"}`,
            });
          } else if (payload.eventType === "UPDATE") {
            setProfiles((current) =>
              current.map((profile) =>
                profile.id === payload.new.id
                  ? (payload.new as Profile)
                  : profile
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProfiles((current) =>
              current.filter((profile) => profile.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);
  return (
    <div>
      <div className="text-2xl font-bold">Pending Approvals</div>
      <AccountApprovalTable columns={ProfileColumns} data={profiles} />
    </div>
  );
}
