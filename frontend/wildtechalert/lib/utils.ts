import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as wkx from "wkx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function coordsToWkb(latitude: number, longitude: number) {
  // Validate inputs
  if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be a number between -90 and 90");
  }

  if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be a number between -180 and 180");
  }

  // Create a Point with SRID 4326 (WGS 84 - standard for GPS)
  const point = new wkx.Point(longitude, latitude);
  point.srid = 4326; // Set the SRID directly on the point

  // Convert to WKB and return as uppercase hex string
  const wkbBuffer = point.toWkb();
  const wkbHex = wkbBuffer.toString("hex").toUpperCase();

  return wkbHex;
}

export function wkbToLatLong(
  coordinates:
    | string
    | Buffer
    | {
        type: "Point";
        coordinates: [number, number];
      }
): { latitude: number; longitude: number } {
  // Handle GeoJSON Point
  if (
    typeof coordinates === "object" &&
    coordinates !== null &&
    !Buffer.isBuffer(coordinates)
  ) {
    if (
      coordinates.type === "Point" &&
      Array.isArray(coordinates.coordinates)
    ) {
      // GeoJSON has [longitude, latitude] order
      const [longitude, latitude] = coordinates.coordinates;
      return { latitude, longitude };
    }
    throw new Error(
      "Invalid GeoJSON object. Expected a Point with coordinates array"
    );
  }

  // Handle WKB (string or Buffer)
  let buffer: Buffer;

  if (typeof coordinates === "string") {
    buffer = Buffer.from(coordinates, "hex");
  } else if (Buffer.isBuffer(coordinates)) {
    buffer = coordinates;
  } else {
    throw new Error(
      "Input must be a WKB hex string, Buffer, or GeoJSON Point object"
    );
  }

  try {
    const geometry = wkx.Geometry.parse(buffer);

    if (geometry.constructor.name !== "Point") {
      throw new Error("WKB represents a geometry that is not a Point");
    }

    const point = geometry as wkx.Point;

    return {
      latitude: point.y,
      longitude: point.x,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse WKB: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function formatTimestamp(timestamp: string | number | Date): string {
  return new Date(timestamp).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
    timeZoneName: "short", // e.g., GMT, BST
  });
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
}

export function formatDateSmartCompact(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const isToday = isSameDay(date, now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = isSameDay(date, yesterday);

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) {
    return `Today • ${time}`;
  } else if (isYesterday) {
    return `Yesterday • ${time}`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
