"use client";

import { Detection } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUserRole } from "@/hooks/use-role";

export const DetectionColumns: ColumnDef<Detection>[] = [
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
    accessorKey: "device_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Device Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "received_at",
    header: "Received At",
    cell: ({ row }) => {
      const timestamp = row.original.received_at;

      if (!timestamp) return "N/A"; // Handle missing values

      const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
        // timeZoneName: "short", // Show time zone
      });

      return formattedDate;
    },
  },
  {
    accessorKey: "detected_at",
    header: "Detected At",
    cell: ({ row }) => {
      const timestamp = row.original.detected_at;

      if (!timestamp) return "N/A"; // Handle missing values

      const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
        // timeZoneName: "short", // Show time zone
      });

      return formattedDate;
    },
  },
  {
    accessorKey: "audio_detected",
    header: "Audio Detected",
    cell: ({ row }) => {
      const detected = row.original.audio_detected;

      const label =
        detected === true ? "Yes" : detected === false ? "No" : "N/A";
      const color =
        detected === true
          ? "bg-green-100 text-green-800"
          : detected === false
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-600";

      return <span className={`px-2 py-1 rounded ${color}`}>{label}</span>;
    },
  },
  {
    accessorKey: "camera_detected",
    header: "Camera Detected",
    cell: ({ row }) => {
      const detected = row.original.camera_detected;

      const label =
        detected === true ? "Yes" : detected === false ? "No" : "N/A";
      const color =
        detected === true
          ? "bg-green-100 text-green-800"
          : detected === false
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-600";

      return <span className={`px-2 py-1 rounded ${color}`}>{label}</span>;
    },
  },
  {
    accessorKey: "confidence_level_audio",
    header: "Audio Confidence",
    cell: ({ row }) => {
      const confidence = row.original.confidence_level_audio;

      const percentage =
        confidence !== null && confidence !== undefined
          ? Math.round(confidence * 100)
          : null;

      const label = percentage !== null ? `${percentage}%` : "N/A";

      const color =
        percentage === null
          ? "bg-gray-100 text-gray-600"
          : percentage > 60
          ? "bg-green-100 text-green-800"
          : percentage > 40
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800";

      return <span className={`px-2 py-1 rounded ${color}`}>{label}</span>;
    },
  },
  {
    accessorKey: "confidence_level_camera",
    header: "Camera Confidence",
    cell: ({ row }) => {
      const confidence = row.original.confidence_level_camera;

      const percentage =
        confidence !== null && confidence !== undefined
          ? Math.round(confidence * 100)
          : null;

      const label = percentage !== null ? `${percentage}%` : "N/A";

      const color =
        percentage === null
          ? "bg-gray-100 text-gray-600"
          : percentage > 60
          ? "bg-green-100 text-green-800"
          : percentage > 40
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800";

      return <span className={`px-2 py-1 rounded ${color}`}>{label}</span>;
    },
  },
  {
    accessorKey: "sound_url",
    header: "Sound URL",
    cell: ({ row }) => {
      const soundUrl = row.original.sound_url;
      return soundUrl ? (
        <Button variant="ghost" asChild>
          <Link href={soundUrl} target="_blank" rel="noopener noreferrer">
            Click here
          </Link>
        </Button>
      ) : (
        "No link"
      );
    },
  },
  {
    accessorKey: "image_url",
    header: "Image URL",
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
      return imageUrl ? (
        <Button variant="ghost" className="" asChild>
          <Link href={imageUrl} target="_blank" rel="noopener noreferrer">
            Click here
          </Link>
        </Button>
      ) : (
        "No link"
      );
    },
  },
  // {
  //   accessorKey: "weather",
  //   header: "Weather",
  //   cell: ({ row }) => {
  //     const weather = row.original.weather;

  //     if (!weather || Object.keys(weather).length === 0) {
  //       return <div>N/A</div>;
  //     }

  //     return (
  //       <div className="space-y-1">
  //         {Object.entries(weather).map(([key, value]) => (
  //           <div key={key} className="text-sm text-muted-foreground">
  //             <strong>{key}:</strong> {String(value)}
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   },
  // },
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
  // {
  //   accessorKey: "registered_at",
  //   header: "Registered At",
  //   cell: ({ row }) => {
  //     const timestamp = row.original.registered_at;

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
    id: "actions",
    cell: ({ row }) => {
      const detection = row.original;
      const role = useUserRole();
      const isAdmin = role === "admin";
      if (!isAdmin) return null;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(detection.id)}
              className="bg-red-500"
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
