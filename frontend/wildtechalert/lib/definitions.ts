export type Device = {
  id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  battery_level: number;
  last_ping: string; // ISO date string
  coordinates: {
    type: "Point"; // Assuming it's always "Point"
    crs: any; // You might need to define this more precisely if you know its structure
    coordinates: [number, number]; // Assuming it's [longitude, latitude]
  };
  status: "online" | "offline"; // Assuming only these two statuses exist
  code: string;
};

export type Detection = {
  id: string; // UUID
  received_at: string; // Timestamp (ISO 8601 format)
  detected_at: string; // Timestamp (ISO 8601 format)
  confidence_level_audio: number; // Float (4-byte)
  confidence_level_camera: number; // Float (4-byte)
  audio_detected: boolean;
  camera_detected: boolean;
  device_code: string; // Text
  weather: Record<string, any>; // JSONB (flexible object structure)
  sound_url: string; // Text (likely a URL)
  image_url: string; // Text (likely a URL)
};

export type WeatherLayer =
  | "temp"
  | "precipitation"
  | "wind"
  | "clouds"
  | "none";
