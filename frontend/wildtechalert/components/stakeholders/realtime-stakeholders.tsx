"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StakeholdersTable from "@/components/stakeholders/table";
import { StakeholderColumns } from "@/components/stakeholders/columns";
import { Stakeholder } from "@/lib/definitions";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useUserRole } from "@/hooks/use-role";

export default function RealTimeStakeholdersPage({
  initialStakeholders,
}: {
  initialStakeholders: Stakeholder[];
}) {
  const [stakeholders, setStakeholders] = useState(initialStakeholders);
  const supabase = createClient();
  const role = useUserRole();

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel("stakeholders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "stakeholders",
        },
        (payload: RealtimePostgresChangesPayload<Stakeholder>) => {
          // Handle different event types
          if (payload.eventType === "INSERT") {
            setStakeholders((current) => [
              ...current,
              payload.new as Stakeholder,
            ]);
          } else if (payload.eventType === "UPDATE") {
            setStakeholders((current) =>
              current.map((stakeholder) =>
                stakeholder.id === payload.new.id
                  ? (payload.new as Stakeholder)
                  : stakeholder
              )
            );
          } else if (payload.eventType === "DELETE") {
            setStakeholders((current) =>
              current.filter((stakeholder) => stakeholder.id !== payload.old.id)
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
      <div className="mb-4 text-xl md:text-2xl">Stakeholders</div>
      <StakeholdersTable
        columns={StakeholderColumns(role)}
        data={stakeholders}
      />
    </div>
  );
}
