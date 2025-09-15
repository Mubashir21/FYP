"use client";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

const data = [
  {
    id: 1,
    emoji: "🌿",
    title: "Enhanced Safety",
    content: "Increases safety for people and elephants",
  },
  {
    id: 2,
    emoji: "🐘",
    title: "Harmonious Coexistence",
    content:
      "Supports harmonious coexistence in human–elephant shared landscapes",
  },
  {
    id: 3,
    emoji: "🌍",
    title: "Environmental Monitoring",
    content: "Can be used for biodiversity and environmental monitoring",
  },
  {
    id: 4,
    emoji: "🏡",
    title: "Versatile Application",
    content: "Ideal for villages, plantations, and wildlife corridors",
  },
];

export default function Homecarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <div className="flex items-center justify-center">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-xs"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {data.map((item) => (
            <CarouselItem key={item.id}>
              <div className="p-1">
                <Card>
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-6">
                    <p className="text-center text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
