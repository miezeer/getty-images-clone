import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { RealtimeUploadProvider, RealtimeUploadNotifications } from "@/components/RealtimeUploadManager";

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIZER - Professional Stock Photos & Images",
  description: "Discover high-quality stock photos, illustrations, and videos for your creative projects. Professional content from talented photographers worldwide.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <RealtimeUploadProvider>
          <ClientBody>{children}</ClientBody>
          <RealtimeUploadNotifications />
        </RealtimeUploadProvider>
      </body>
    </html>
  );
}
