import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merit — Admissions OS",
  description: "Verified admissions matching and application management for education consultancies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
