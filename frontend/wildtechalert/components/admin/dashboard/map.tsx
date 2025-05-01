"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Device, WeatherLayer } from "@/lib/definitions";
import Legend from "./weather-legend";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const customIcon = new L.Icon({
  iconUrl: "/map-icon.svg",
  // shadowUrl: markerShadow.src,
  iconSize: [50, 82],
  iconAnchor: [25, 82],
});

interface MapProps {
  devices: Device[];
}

export default function Map({ devices }: MapProps) {
  const [selectedLayer, setSelectedLayer] = useState<WeatherLayer>("temp");

  const getWeatherOverlayUrl = (layer: WeatherLayer): string => {
    return `https://{s}.tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Device Map</CardTitle>
          <CardDescription>
            Showing the locations of the devices
          </CardDescription>
        </div>
        <Select
          value={selectedLayer}
          onValueChange={(value) => {
            setSelectedLayer(value as WeatherLayer);
          }}
        >
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Select overlay" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectGroup>
              <SelectLabel>Layers</SelectLabel>
              <SelectItem value="temp">Temperature</SelectItem>
              <SelectItem value="precipitation">Precipitation</SelectItem>
              <SelectItem value="wind">Wind</SelectItem>
              <SelectItem value="clouds">Cloud</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-[500px] p-0">
        <div className="relative h-full w-full rounded-b-lg overflow-hidden">
          <MapContainer
            center={
              devices.length > 0
                ? [
                    devices[0].coordinates.coordinates[1],
                    devices[0].coordinates.coordinates[0],
                  ]
                : [2.947472, 101.8737429]
            }
            zoom={13}
            className="h-full w-full z-0"
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Esri"
            />
            {selectedLayer !== "none" && (
              <TileLayer
                url={getWeatherOverlayUrl(selectedLayer)}
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              />
            )}

            {devices.map((device) => {
              const [longitude, latitude] = device.coordinates.coordinates;

              return (
                <Marker
                  key={device.id}
                  position={[latitude, longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <p className="text-xl">{device.name}</p>
                    <br />
                    Latitude: {latitude}, Longitude: {longitude}
                    <br />
                    Battery: {device.battery_level}
                    <br />
                    Status: {device.status}
                    <br />
                    Last Ping: {device.last_ping}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
          <Legend layerType={selectedLayer} />
        </div>
      </CardContent>
    </Card>
  );
}
