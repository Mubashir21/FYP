"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import DetectionsTable from "@/components/detections/table";
import { DetectionColumns } from "@/components/detections/columns";
import { Detection } from "@/lib/definitions";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";

export default function RealTimeDetectionsTable({
  initialDetections,
}: {
  initialDetections: Detection[];
}) {
  const [detections, setDetections] = useState(initialDetections);
  const supabase = createClient();

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel("detections-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "detections",
        },
        (payload: RealtimePostgresChangesPayload<Detection>) => {
          // Handle different event types
          if (payload.eventType === "INSERT") {
            const newDetection = payload.new as Detection;

            setDetections((current) => [...current, newDetection]);

            toast.success("New detection recieved!", {
              description: `From: ${newDetection.device_name || "Unknown"}`,
            });
          } else if (payload.eventType === "UPDATE") {
            setDetections((current) =>
              current.map((detection) =>
                detection.id === payload.new.id
                  ? (payload.new as Detection)
                  : detection
              )
            );
          } else if (payload.eventType === "DELETE") {
            setDetections((current) =>
              current.filter((detection) => detection.id !== payload.old.id)
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
      <div className="mb-4 text-xl md:text-2xl">Detections</div>
      <DetectionsTable columns={DetectionColumns} data={detections} />
    </div>
  );
}
