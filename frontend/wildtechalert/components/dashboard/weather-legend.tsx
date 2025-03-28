"use client";
import { WeatherLayer } from "@/lib/definitions";
import "leaflet/dist/leaflet.css";

export default function Legend({ layerType }: { layerType: WeatherLayer }) {
  const getLegendConfig = () => {
    switch (layerType) {
      case "temp":
        return {
          title: "Temperature, °C",
          gradient:
            "linear-gradient(to left, #91003f, #ff3300, #ffcc00, #00ff00, #0099ff, #4b0082)",
          min: "40°C",
          max: "-30°C",
          steps: ["40", "20", "0", "-20"],
        };
      case "precipitation":
        return {
          title: "Precipitation, mm",
          gradient:
            "linear-gradient(to right, #00008B, #1E90FF, #00FF00, #FFD700, #FF4500, #8B0000)",
          min: "200+ mm",
          max: "0 mm",
          steps: ["200", "150", "100", "50", "0"],
        };
      case "wind":
        return {
          title: "Wind Speed, m/s",
          gradient:
            "linear-gradient(to left, #6e0123, #ef4e4a, #f7c59f, #6497b1, #011f4b)",
          min: "25+ m/s",
          max: "0 m/s",
          steps: ["25", "20", "15", "10", "5", "0"],
        };
      case "clouds":
        return {
          title: "Clouds",
          gradient:
            "linear-gradient(to right, #000000, #525252, #d9d9d9, #ffffff)",
          min: "100%",
          max: "0%",
          steps: ["100%", "75%", "50%", "25%", "0%"],
        };
      default:
        return {
          title: "",
          gradient: "",
          min: "",
          max: "",
          steps: [],
        };
    }
  };

  const config = getLegendConfig();

  return (
    <div className="flex absolute top-4 right-4 bg-white p-3 rounded-md z-10 gap-4">
      <h3 className="text-sm mb-2">{config.title}</h3>
      <div className="flex flex-col items-center gap-1">
        <div
          className="w-60 h-2  rounded-sm"
          style={{
            background: config.gradient,
            position: "relative",
          }}
        ></div>
        <div className="w-full flex justify-between text-xs flex-row">
          {config.steps
            .slice()
            .reverse()
            .map((step, index) => (
              <div key={index} className="text-xs ">
                {step}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
