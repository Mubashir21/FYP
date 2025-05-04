import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({ data }: { data: string[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card shadow-lg">
        <CardHeader className="relative">
          <CardDescription>Today&apos;s Detections</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            <span>{data[4]}</span>{" "}
            <span className="text-base font-medium text-muted-foreground">
              / {data[1]}
            </span>
          </CardTitle>
          <div className="absolute right-4 top-4">
            {/* <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge> */}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this week <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Detections for the last month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card shadow-lg">
        <CardHeader className="relative">
          <CardDescription>Active Devices</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data[0]}
          </CardTitle>
          <div className="absolute right-4 top-4">
            {/* <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge> */}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {/* Down 20% this period <TrendingDownIcon className="size-4" /> */}
            Stayed steady
          </div>
          <div className="text-muted-foreground">
            No new devices added this month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card shadow-lg">
        <CardHeader className="relative">
          <CardDescription>Alerts Sent</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data[3]}
          </CardTitle>
          <div className="absolute right-4 top-4">
            {/* <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge> */}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Alerts down this week
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Less active alert recipients
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card shadow-lg">
        <CardHeader className="relative">
          <CardDescription>Subscribed Stakeholders</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {data[2]}
          </CardTitle>
          <div className="absolute right-4 top-4">
            {/* <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge> */}
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active Subscribers down <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            More stakeholders opting out
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
