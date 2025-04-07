"use client";

import { Registration } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const RegistrationColumns: ColumnDef<Registration>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "api_key",
    header: "API Key",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const timestamp = row.original.created_at;

      if (!timestamp) return "N/A"; // Handle missing values

      const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
        timeZoneName: "short", // Show time zone
      });

      return formattedDate;
    },
  },
  {
    accessorKey: "used_at",
    header: "Used At",
    cell: ({ row }) => {
      const timestamp = row.original.used_at;

      if (!timestamp) return "N/A"; // Handle missing values

      const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
        timeZoneName: "short", // Show time zone
      });

      return formattedDate;
    },
  },
];
