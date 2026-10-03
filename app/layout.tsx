import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/lib/smooth-scroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meridian | Money that moves at the speed of intent",
  description:
    "One titanium card, one live ledger, every currency. Meridian settles, sorts and reconciles your money the moment it moves.",
};

export const viewport: Viewport = {
  themeColor: "#07080A",
};

// Sets the board scale before first paint so pinned sections don't jump on load.
const fitStage = `document.documentElement.style.setProperty("--s", Math.min(innerWidth / 1440, innerHeight / 900))`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitStage }} />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
