"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Device } from "@/lib/definitions";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-role";
import DevicesTable from "@/components/admin/devices/devices-table";
import { DeviceColumns } from "./columns";

export default function RealTimeDevicesTable({
  initialDevices,
}: {
  initialDevices: Device[];
}) {
  const [devices, setDevices] = useState(initialDevices);
  const supabase = createClient();

  const role = useUserRole();

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel("devices-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "devices",
        },
        (payload: RealtimePostgresChangesPayload<Device>) => {
          // Handle different event types
          if (payload.eventType === "INSERT") {
            const newDevice = payload.new as Device;

            setDevices((current) => [...current, newDevice]);

            toast.success("New device added!", {
              description: `From: ${newDevice.name || "Unknown"}`,
            });
          } else if (payload.eventType === "UPDATE") {
            setDevices((current) =>
              current.map((device) =>
                device.id === payload.new.id ? (payload.new as Device) : device
              )
            );
          } else if (payload.eventType === "DELETE") {
            setDevices((current) =>
              current.filter((device) => device.id !== payload.old.id)
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
      <div className="mb-4 text-xl md:text-2xl">Devices</div>
      <DevicesTable columns={DeviceColumns(role)} data={devices} />
    </div>
  );
}
