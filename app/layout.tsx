import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import { PlayerProvider } from '@/context/PlayerContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "echo - where silence ends.",
  description:
    "echo is a beautifully designed music player that brings your favorite tracks to life. With a clean interface, smooth playback, and handpicked collections, Echo lets you vibe, discover, and replay the music you love - anytime, anywhere.",
  keywords: [
    "Echo",
    "music player",
    "minimal music app",
    "aesthetic music",
    "MP3 player",
    "online music",
    "Next.js music player",
    "Rehan music app",
  ],
  authors: [{ name: "Rehan" }],
  creator: "Rehan",
  publisher: "Rehan",
  metadataBase: new URL("https://echo-rehan.vercel.app"),
  openGraph: {
    title: "echo - where silence ends.",
    description:
      "echo is a beautifully designed music player that brings your favorite tracks to life. With a clean interface, smooth playback, and handpicked collections, Echo lets you vibe, discover, and replay the music you love - anytime, anywhere.",
    url: "https://echo-rehan.vercel.app",
    siteName: "echo",
    images: [
      {
        url: "/echo.png",
        width: 1200,
        height: 630,
        alt: "echo app preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "echo - where silence ends.",
    description:
      "echo is a beautifully designed music player that brings your favorite tracks to life.",
    images: [
      "https://res.cloudinary.com/ddkf3mink/image/upload/v1753969609/echo_banner_e6aq5b.png"
    ],
    creator: "@Rehanskyyyy",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PlayerProvider>{children}</PlayerProvider>
        </body>
      </SessionWrapper>
    </html>
  );
}
