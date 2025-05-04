"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Detection, Device } from "@/lib/definitions";
import React from "react";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function DetectionsByDevicesChart({
  detections,
  devices,
}: {
  detections: Detection[];
  devices: Device[];
}) {
  // Process data for the chart
  const chartData = React.useMemo(() => {
    // Create a map to count detections by device
    const deviceCounts: Record<
      string,
      { device: string; audio: number; camera: number; total: number }
    > = {};

    // Initialize counts for all devices
    devices.forEach((device) => {
      deviceCounts[device.name] = {
        // device: device.name.slice(5, 7),
        device: device.name,
        audio: 0,
        camera: 0,
        total: 0,
      };
    });

    // Count detections by device
    detections.forEach((detection) => {
      const deviceName = detection.device_name;

      // Skip if device doesn't exist in our list
      if (!deviceCounts[deviceName]) return;

      if (detection.audio_detected) deviceCounts[deviceName].audio++;
      if (detection.camera_detected) deviceCounts[deviceName].camera++;

      // Count as one detection regardless of how many types
      deviceCounts[deviceName].total++;
    });

    // Convert to array and sort by total detections (descending)
    return Object.values(deviceCounts);
  }, [detections, devices]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Detections by Device</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="device"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {/* <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const { device, total } = payload[0].payload;

                return (
                  <div className="rounded-md border bg-white p-2 shadow-sm text-sm">
                    <div className="font-medium text-muted-foreground">
                      Device: <span className="text-foreground">{device}</span>
                    </div>
                    <div>Total Detections: {total}</div>
                  </div>
                );
              }}
            /> */}
            <Bar dataKey="total" fill={chartConfig.total.color} radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total detections by device since inception
        </div>
      </CardFooter>
    </Card>
  );
}
