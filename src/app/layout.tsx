import type { Metadata } from "next";
import { Caveat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["SOFT", "opsz"] });
// Handwritten notes on the dashboard.
const script = Caveat({ subsets: ["latin"], variable: "--font-script", weight: ["500", "600"] });

export const metadata: Metadata = {
  title: "Eligify · Admissions OS",
  description: "Verified admissions matching and application management for education consultancies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${sans.variable} ${display.variable} ${script.variable}`}><body>{children}</body></html>;
}
