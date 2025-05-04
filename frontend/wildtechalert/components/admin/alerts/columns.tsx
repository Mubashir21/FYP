"use client";

import { EmailAlert } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, CheckCircle2, Clock3, XCircle, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateSmartCompact } from "@/lib/utils";

export const EmailAlertsColumns = (): ColumnDef<EmailAlert>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sent_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Sent At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.original.sent_at;
      if (!timestamp) return "N/A";
      return formatDateSmartCompact(timestamp);
    },
  },
  {
    accessorKey: "device_name",
    header: "Device",
  },
  {
    accessorKey: "stakeholder_name",
    header: "Stakeholder",
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => {
      const channel = row.original.channel;

      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
          <Mail className="w-4 h-4" />
          {channel}
        </span>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusConfig = {
        sent: {
          label: "Sent",
          color: "bg-green-100 text-green-700",
          icon: <CheckCircle2 className="w-4 h-4" />,
        },
        pending: {
          label: "Pending",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock3 className="w-4 h-4" />,
        },
        failed: {
          label: "Failed",
          color: "bg-red-100 text-red-700",
          icon: <XCircle className="w-4 h-4" />,
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig] ?? {
        label: status,
        color: "bg-gray-100 text-gray-700",
        icon: null,
      };

      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 font-medium rounded-full capitalize ${config.color}`}
        >
          {config.icon}
          {config.label}
        </span>
      );
    },
  },
];
