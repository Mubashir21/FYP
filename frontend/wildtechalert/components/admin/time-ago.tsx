"use client";

import { useEffect, useState } from "react";

export function TimeAgo({ timestamp }: { timestamp: string }) {
  const [relative, setRelative] = useState("");

  useEffect(() => {
    const updateRelativeTime = () => {
      const now = new Date();
      const past = new Date(timestamp);
      const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);

      if (diffSec < 5) return "Just now";
      if (diffSec < 60)
        return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;

      const minutes = Math.floor(diffSec / 60);
      if (minutes < 60)
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

      const hours = Math.floor(minutes / 60);
      if (hours < 48) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    };

    setRelative(updateRelativeTime());
    const interval = setInterval(() => {
      setRelative(updateRelativeTime());
    }, 15000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="text-sm">{relative}</span>;
}
