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
  created_at: string; // Timestamp (ISO 8601 format)
  confidence_level: number; // Float (4-byte)
  device_code: string; // Text
  weather: Record<string, any>; // JSONB (flexible object structure)
  sound_url: string; // Text (likely a URL)
};

export type WeatherLayer =
  | "temp"
  | "precipitation"
  | "wind"
  | "clouds"
  | "none";
