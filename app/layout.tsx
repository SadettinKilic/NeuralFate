import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/lib/contexts/GameContext";

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
    <html lang="en">
      <body className="antialiased">
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
