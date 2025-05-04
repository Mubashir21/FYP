"use client";

import { Detection } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { TimeAgo } from "../time-ago";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";
import { deleteDetection } from "@/lib/actions";

export const DetectionColumns = (role: string): ColumnDef<Detection>[] => [
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
          className="p-0"
        >
          Device Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "received_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Received At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.original.received_at;
      if (!timestamp) return "N/A";
      return <TimeAgo timestamp={timestamp} />;
    },
  },

  // {
  //   accessorKey: "detected_at",
  //   header: "Detected At",
  //   cell: ({ row }) => {
  //     const timestamp = row.original.detected_at;

  //     if (!timestamp) return "N/A"; // Handle missing values

  //     const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
  //       year: "numeric",
  //       month: "short",
  //       day: "2-digit",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: false, // Use 24-hour format
  //       // timeZoneName: "short", // Show time zone
  //     });

  //     return formattedDate;
  //   },
  // },
  {
    accessorKey: "audio_detected",
    header: "Audio Detected",
    cell: ({ row }) => {
      const detected = row.original.audio_detected;
      return detected ? (
        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full ">
          <CheckCircle className="w-3 h-3" /> Yes
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full ">
          <XCircle className="w-3 h-3" /> No
        </span>
      );
    },
  },
  {
    accessorKey: "camera_detected",
    header: "Camera Detected",
    cell: ({ row }) => {
      const detected = row.original.camera_detected;
      return detected ? (
        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full ">
          <CheckCircle className="w-3 h-3" /> Yes
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full ">
          <XCircle className="w-3 h-3" /> No
        </span>
      );
    },
  },
  {
    accessorKey: "confidence_level_audio",
    header: "Audio Confidence",
    cell: ({ row }) => {
      const confidence = row.original.confidence_level_audio;
      const percentage =
        confidence != null ? Math.round(confidence * 100) : null;
      const label = percentage != null ? `${percentage}%` : "N/A";
      const color =
        percentage == null
          ? "bg-gray-100 text-gray-600"
          : percentage > 60
            ? "bg-green-100 text-green-800"
            : percentage > 40
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800";

      return (
        <span
          className={`px-2 py-1 rounded-full font-medium ${color}`}
          title={confidence?.toFixed(2)}
        >
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "confidence_level_camera",
    header: "Camera Confidence",
    cell: ({ row }) => {
      const confidence = row.original.confidence_level_camera;
      const percentage =
        confidence != null ? Math.round(confidence * 100) : null;
      const label = percentage != null ? `${percentage}%` : "N/A";
      const color =
        percentage == null
          ? "bg-gray-100 text-gray-600"
          : percentage > 60
            ? "bg-green-100 text-green-800"
            : percentage > 40
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800";

      return (
        <span
          className={`px-2 py-1 rounded-full font-medium ${color}`}
          title={confidence?.toFixed(2)}
        >
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "sound_url",
    header: "Audio",
    cell: ({ row }) => {
      const soundUrl = row.original.sound_url;
      return soundUrl ? (
        <Button
          variant="link"
          className="p-0 h-auto text-sm text-slate-600 hover:underline hover:text-slate-900 transition-colors"
          asChild
        >
          <Link href={soundUrl} target="_blank" rel="noopener noreferrer">
            View
          </Link>
        </Button>
      ) : (
        <span className="text-sm text-muted-foreground italic">No link</span>
      );
    },
  },
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;

      if (!imageUrl)
        return (
          <span className="text-sm text-muted-foreground italic">No link</span>
        );

      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-slate-600 hover:underline hover:text-slate-900 transition-colors"
              asChild
            >
              <Link href={imageUrl} target="_blank" rel="noopener noreferrer">
                View
              </Link>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto p-2">
            <img
              src={imageUrl}
              alt="Detection preview"
              className="rounded-md max-w-xs max-h-48 object-contain border"
            />
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const detection = row.original;

      if (role !== "admin") return null;

      const handleDelete = async () => {
        try {
          const result = await deleteDetection(detection.id);
          if (result.success) {
            toast.success("Detection deleted successfully");
          } else {
            toast.error(result.error || "Failed to delete detection");
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
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
