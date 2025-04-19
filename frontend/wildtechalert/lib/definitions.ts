export type Device = {
  id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  battery_level: number;
  last_ping: string; // ISO date string
  coordinates: {
    type: "Point"; // Assuming it's always "Point"
    coordinates: [number, number]; // Assuming it's [longitude, latitude]
  };
  status: "online" | "offline"; // Assuming only these two statuses exist
  name: string;
  registered_at: string; // ISO date string
  api_key: string; // UUID
};

export type Detection = {
  id: string; // UUID
  received_at: string; // Timestamp (ISO 8601 format)
  detected_at: string; // Timestamp (ISO 8601 format)
  confidence_level_audio: number; // Float (4-byte)
  confidence_level_camera: number; // Float (4-byte)
  audio_detected: boolean;
  camera_detected: boolean;
  device_name: string; // Text
  weather: WeatherData; // JSONB (flexible object structure)
  sound_url: string; // Text (likely a URL)
  image_url: string; // Text (likely a URL)
};

export type WeatherData = {
  temperature?: number;
  humidity?: number;
  conditions?: string;
};

export type WeatherLayer =
  | "temp"
  | "precipitation"
  | "wind"
  | "clouds"
  | "none";

export type Registration = {
  id: string; // UUID
  code: string; // Text
  status: "used" | "unused"; // enum
  api_key: string; // Text (UUID)
  created_at: string; // Timestamp (ISO 8601 format)
  used_at: string | null; // Timestamp (ISO 8601 format) or null
};

export type Stakeholder = {
  id: string; // UUID
  name: string; // Text
  email: string; // Text
  phone: string; // Varchar
  created_at: string; // Timestamp (ISO 8601 format)
  updated_at: string; // Timestamp (ISO 8601 format)
  subscribed: boolean; // Boolean
};
