"use client";

import { Device } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDevice } from "@/lib/actions";
import Link from "next/link";
import { formatDateSmartCompact } from "@/lib/utils";
import { LastPing } from "../last-ping";

export const DeviceColumns = (role: string): ColumnDef<Device>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "battery_level",
    header: "Battery Level",
    cell: ({ row }) => {
      const batteryLevel = row.original.battery_level; // Get the battery level
      return `${batteryLevel}%`; // Format as percentage
    },
  },
  {
    accessorKey: "last_ping",
    header: "Last Ping",
    cell: ({ row }) => {
      const timestamp = row.original.last_ping;
      if (!timestamp) return "N/A";

      return <LastPing timestamp={timestamp} />;
    },
  },
  {
    accessorKey: "coordinates",
    header: "Coordinates",
    cell: ({ row }) => {
      const coords = row.original.coordinates;

      if (!coords || !coords.coordinates || coords.coordinates.length < 2) {
        return "N/A"; // Handle missing or invalid coordinates
      }

      const [longitude, latitude] = coords.coordinates; // Extract lat/lng

      return (
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          title="View location on map"
          className="inline-flex items-center gap-1 hover:underline"
        >
          <MapPin className="w-4 h-4" />
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </a>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isOnline = status === "online";

      const dotColor = isOnline ? "bg-green-500" : "bg-red-500";
      const bgColor = isOnline ? "bg-green-100" : "bg-red-100";
      const textColor = isOnline ? "text-green-700" : "text-red-700";
      const label = isOnline ? "Online" : "Offline";

      return (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} ${textColor} text-sm font-medium`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`}
            ></span>
          </span>
          {label}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "update_at",
  //   header: "Updated At",
  //   cell: ({ row }) => {
  //     const timestamp = row.original.updated_at;

  //     if (!timestamp) return "N/A"; // Handle missing values

  //     const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
  //       year: "numeric",
  //       month: "short",
  //       day: "2-digit",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: false, // Use 24-hour format
  //       timeZoneName: "short", // Show time zone
  //     });

  //     return formattedDate;
  //   },
  // },
  {
    accessorKey: "registered_at",
    header: "Registered At",
    cell: ({ row }) => {
      const timestamp = row.original.registered_at;

      if (!timestamp) return "N/A"; // Handle missing values

      return formatDateSmartCompact(timestamp);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const device = row.original;

      if (role !== "admin") return null;

      const handleDelete = async () => {
        try {
          const result = await deleteDevice(device.id);
          if (result.success) {
            toast.success("Device deleted successfully");
          } else {
            toast.error(result.error || "Failed to delete device");
          }
        } catch (error) {
          toast.error("An unexpected error occurred");
          console.error("Delete error:", error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/devices/${device.id}/edit`}
                // className="rounded-md border p-2 hover:bg-gray-100"
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
