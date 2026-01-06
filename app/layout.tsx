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
  title: "Neural Fate - Hibrit YZ Dedektiflik Oyunu",
  description: "Yapay zeka destekli, sıradan seçimlerinizin cinayete yol açtığı fütüristik bir dedektiflik deneyimi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${orbitron.variable} ${shareTechMono.variable}`}>
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
