import type { Metadata } from "next";
import { inter } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "WildTechAlert",
  description: "Alerting and Nurturing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
