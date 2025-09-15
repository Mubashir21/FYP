import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  className?: string;
}

export function ResponsiveContainer({
  children,
  maxWidth = "7xl",
  className,
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm", // 384px
    md: "max-w-md", // 448px
    lg: "max-w-lg", // 512px
    xl: "max-w-xl", // 576px
    "2xl": "max-w-2xl", // 672px
    "3xl": "max-w-3xl", // 768px
    "4xl": "max-w-4xl", // 896px
    "5xl": "max-w-5xl", // 1024px
    "6xl": "max-w-6xl", // 1152px
    "7xl": "max-w-7xl", // 1280px
  };

  return (
    <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}
