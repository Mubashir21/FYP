"use client";

import { Detection, Device } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const DeviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: "code",
    header: "Code",
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
          className="text-blue-500 underline"
        >
          Open in Maps
        </a>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
  },
];

export const DetectionSummaryColumns: ColumnDef<Detection>[] = [
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
        timeZoneName: "short", // Show time zone
      });

      return formattedDate;
    },
  },
  {
    accessorKey: "audio_confidence",
    header: "Audio Confidence",
    cell: ({ row }) => {
      const confidenceLevel = row.original.confidence_level_audio; // Get the battery level
      return `${confidenceLevel}%`; // Format as percentage
    },
  },
  {
    accessorKey: "camera_confidence",
    header: "Camera Confidence",
    cell: ({ row }) => {
      const confidenceLevel = row.original.confidence_level_camera; // Get the battery level
      return `${confidenceLevel}%`; // Format as percentage
    },
  },
  {
    accessorKey: "device_code",
    header: "Device",
  },
  {
    accessorKey: "sound_url",
    header: "Sound URL",
    cell: ({ row }) => {
      const soundUrl = row.original.sound_url;
      return soundUrl ? (
        <Link href={soundUrl} target="_blank" rel="noopener noreferrer">
          Click here
        </Link>
      ) : (
        "No link"
      ); // Render nothing if there's no URL
    },
  },
  {
    accessorKey: "image_url",
    header: "Image URL",
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
      return imageUrl ? (
        <Link href={imageUrl} target="_blank" rel="noopener noreferrer">
          Click here
        </Link>
      ) : (
        "No link"
      ); // Render nothing if there's no URL
    },
  },
];
