import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Homecarousel from "@/components/public-carousel";
import { Timeline } from "antd";
import { ResponsiveContainer } from "@/components/responsive-container";

export default function Home() {
  return (
    <main className="min-h-full">
      <div className="bg-stone-200 bg-cover bg-center bg-no-repeat py-10">
        <ResponsiveContainer maxWidth="6xl" className="px-5 h-full">
          <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col gap-6 h-full text-center">
            <div className="flex flex-col gap-6">
              <p className="text-xl font-light flex flex-col gap-4">
                <span className="text-sm font-bold text-muted-foreground">Protecting People. Protecting Elephants. Powered by AI.</span>
                <span className="text-7xl font-semibold">WildTechAlert!</span>
              </p>
              <span className="text-zinc-500 font-medium text-sm px-56">A real-time AI-powered detection system that automatically sends alerts when elephants are at risk of dangerous encounters or when suspicious human activity is detected near their movement areas.</span>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" color="red" asChild>
                <Link href="/login">Talk to Us</Link>
              </Button>
              <Button className="bg-gray-500" asChild>
                <Link href="#">How It Works</Link>
              </Button>
            </div>
            
            
          </div>
          <div className="flex flex-col items-center gap-6">
              <div className="flex gap-20 items-center">
                <Image src="/MEME-logo.avif" alt="MEME Logo" width={120} height={60} className="invert" />
                <Image src="/notts-logo.png" alt="Nottingham Logo" width={120} height={60} />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Developed by the University of Nottingham Malaysia’s MEME project</span>
            </div>
            <div><Image src="/macbook-hero.png" alt="Hero" width={1000} height={1000} /></div>
            </div>
          
        </ResponsiveContainer>
      </div>
      <div className="">
        <ResponsiveContainer maxWidth="6xl" className="py-10 px-6">
          <div className="flex gap-6"><div className="flex flex-col gap-5 border-l-2 border-gray-300 pl-6">
            <p className="font-bold text-2xl ">
            The Challenge
            </p>
            <p className="text-justify text-sm text-muted-foreground ">
              WildTechAlert is a real-time AI-operated detection system that helps
              automatically send alerts when dangerous encounters are predicted
              with elephants or when suspicious human activities are detected near
              elephant movement areas.
            </p>
            {/* <div>
              <Button asChild>
                <Link href="/aboutus">Learn More About Us</Link>
              </Button>
            </div> */}
          </div>
          <Image src="/elephants-road.jpg" alt="Elephant Challenge" width={500} height={1000} className="rounded-lg" /></div>
          
        </ResponsiveContainer>
      </div>
      <div>
        <ResponsiveContainer maxWidth="6xl" className="px-5 my-10">
          <div className="flex flex-col gap-5">
            <p className="font-bold text-3xl">Why WildTechAlert?</p>
            <Homecarousel />
          </div>
        </ResponsiveContainer>
      </div>
      <div>
        <ResponsiveContainer maxWidth="6xl" className="px-5 my-10">
          <div className="flex flex-col gap-5">
            <p className="font-bold text-3xl">What We Offer</p>
            <div className="font-normal">
              <Timeline
                items={[
                  {
                    color: "green",
                    children: "✅ 24/7 coverage",
                  },
                  {
                    color: "green",
                    children: "✅ Secured, hassle-free operations",
                  },
                  {
                    color: "green",
                    children: "✅ Friendly user interface",
                  },

                  {
                    color: "green",
                    children: "✅ Differentiated access levels",
                  },
                  {
                    color: "green",
                    children: "✅ Device upgrades with monthly services",
                  },
                  {
                    color: "green",
                    children:
                      "✅ Backed by experts in elephant behavior and human–elephant conflict",
                  },
                  {
                    color: "green",
                    children:
                      "✅ Research & Development partnerships with universities",
                  },
                  {
                    color: "green",
                    children:
                      "✅ Workshops, training, printed and online support materials",
                  },
                ]}
              />
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
