"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AlertsTable from "./table";
import { EmailAlert } from "@/lib/definitions";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";
import { EmailAlertsColumns } from "./columns";

export default function RealTimeAlertsTable({
  initialAlerts,
}: {
  initialAlerts: EmailAlert[];
}) {
  const [alert, setAlert] = useState(initialAlerts);
  const supabase = createClient();

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel("alerts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alerts",
        },
        (payload: RealtimePostgresChangesPayload<EmailAlert>) => {
          // Handle different event types
          if (payload.eventType === "INSERT") {
            const newAlert = payload.new as EmailAlert;

            setAlert((current) => [...current, newAlert]);

            toast.success("New email sent", {
              description: `Sent to: ${newAlert.stakeholder_name || "Unknown"}`,
            });
          } else if (payload.eventType === "UPDATE") {
            setAlert((current) =>
              current.map((alert) =>
                alert.id === payload.new.id
                  ? (payload.new as EmailAlert)
                  : alert
              )
            );
          } else if (payload.eventType === "DELETE") {
            setAlert((current) =>
              current.filter((alert) => alert.id !== payload.old.id)
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
      {/* <div className="mb-4 text-xl md:text-2xl">Detections</div> */}
      <AlertsTable columns={EmailAlertsColumns()} data={alert} />
    </div>
  );
}
