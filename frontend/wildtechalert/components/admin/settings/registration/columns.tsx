"use client";

import { Registration } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown, Eye, EyeOff } from "lucide-react";
import { formatDateSmartCompact } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const RegistrationColumns: ColumnDef<Registration>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      const config = {
        used: {
          label: "Used",
          className: "bg-green-100 text-green-700",
        },
        unused: {
          label: "Unused",
          className: "bg-yellow-100 text-yellow-800",
        },
      };

      const badge = config[status as keyof typeof config] ?? {
        label: "Unknown",
        className: "bg-gray-100 text-gray-700",
      };

      return (
        <span
          className={`inline-flex items-center px-2 py-1 font-medium rounded-full ${badge.className}`}
        >
          {badge.label}
        </span>
      );
    },
  },

  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const [visible, setVisible] = useState(false);
      const value = row.original.code;

      if (!value) return "N/A";

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {visible ? value : "••••••••••"}
          </span>
          <button
            onClick={() => setVisible(!visible)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            {visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      );
    },
  },
  {
    accessorKey: "api_key",
    header: "API Key",
    cell: ({ row }) => {
      const [visible, setVisible] = useState(false);
      const value = row.original.api_key;

      if (!value) return "N/A";

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {visible ? value : "••••••••••"}
          </span>
          <button
            onClick={() => setVisible(!visible)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            {visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const timestamp = row.original.created_at;

      if (!timestamp) return "N/A"; // Handle missing values

      return formatDateSmartCompact(timestamp);
    },
  },
  {
    accessorKey: "used_at",
    header: "Used At",
    cell: ({ row }) => {
      const timestamp = row.original.used_at;

      if (!timestamp) return "N/A"; // Handle missing values

      return formatDateSmartCompact(timestamp);
    },
  },
];
