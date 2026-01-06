import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/lib/contexts/GameContext";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Neural Fate - Hybrid AI Detective Game",
  description: "A futuristic detective experience powered by AI where your mundane choices lead to murder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${shareTechMono.variable}`}>
      <body className="antialiased font-mono">
        <div className="scanlines" />
        <div className="sun-background" />
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
