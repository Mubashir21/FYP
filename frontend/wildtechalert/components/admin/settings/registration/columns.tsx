"use client";

import { Registration } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatDateSmartCompact } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MaskedValueCell } from "./masked-value-cell";

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
    cell: ({ row }) => <MaskedValueCell value={row.original.code} />,
  },
  {
    accessorKey: "api_key",
    header: "API Key",
    cell: ({ row }) => <MaskedValueCell value={row.original.api_key} />,
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
