"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LastPing({ timestamp }: { timestamp: string }) {
  const [relative, setRelative] = useState("");
  const [statusColor, setStatusColor] = useState("text-muted-foreground");

  useEffect(() => {
    const updateRelativeTime = () => {
      const now = new Date();
      const past = new Date(timestamp);
      const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);

      let label = "";
      let color = "text-muted-foreground";

      if (diffSec < 5) {
        label = "Just now";
      } else if (diffSec < 60) {
        label = `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;
      } else if (diffSec < 3600) {
        const mins = Math.floor(diffSec / 60);
        label = `${mins} minute${mins !== 1 ? "s" : ""} ago`;
      } else {
        const hours = Math.floor(diffSec / 3600);
        label = `${hours} hour${hours !== 1 ? "s" : ""} ago`;
      }

      const diffHours = diffSec / 3600;

      if (diffHours <= 2) {
        color = "text-green-500";
      } else if (diffHours <= 12) {
        color = "text-yellow-500";
      } else if (diffHours <= 24) {
        color = "text-orange-500";
      } else {
        color = "text-red-500";
      }

      setRelative(label);
      setStatusColor(color);
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 15000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div
      className={`inline-flex items-center gap-1 text-sm font-medium ${statusColor}`}
    >
      <Clock className="w-4 h-4 opacity-70" />
      <span>{relative}</span>
    </div>
  );
}
