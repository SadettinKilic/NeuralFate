'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/lib/contexts/GameContext';
import { Monitor, Globe, Bot } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { setGameMode, setGamePhase, setIsVsAI } = useGame();

  const modes = [
    {
      id: 'local',
      title: 'YEREL_MOD',
      description: 'Tek terminalde iki oyuncu için telefon değiştirme deneyimi.',
      icon: Monitor,
      color: 'cyan',
      variant: 'default' as const
    },
    {
      id: 'online',
      title: 'AG_BAGLANTISI',
      description: 'Küresel sinir ağı üzerinden gerçek zamanlı senkronizasyon.',
      icon: Globe,
      color: 'magenta',
      variant: 'terminal' as const
    },
    {
      id: 'solo',
      title: 'VS_YAPAY_ZEKA',
      description: 'Neural Shadow algoritmasına meydan oku.',
      icon: Bot,
      color: 'orange',
      variant: 'default' as const
    }
  ];

  const handleModeSelect = (modeId: string) => {
    setGameMode(modeId as 'local' | 'online' | 'solo');
    setIsVsAI(modeId === 'solo');
    setGamePhase('character');
    router.push(`/game/${modeId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-16 z-10 relative"
      >
        <h1 className="font-heading text-6xl md:text-9xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-cyan)] via-[var(--color-magenta)] to-[var(--color-orange)] text-glow drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]">
          NEURAL FATE
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-mono text-[var(--color-cyan)] text-lg md:text-xl tracking-[0.2em] uppercase"
        >
          &gt; Seçimlerin sona götürdüğü yer
        </motion.p>
      </motion.div>

      {/* Mode selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full z-10 px-4">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
            >
              <Card
                variant={mode.variant}
                className="cursor-pointer group h-full flex flex-col items-center text-center relative overflow-visible"
                onClick={() => handleModeSelect(mode.id)}
              >
                {/* Floating Icon Container */}
                <div className="mb-6 relative">
                  <div className={`absolute inset-0 bg-${mode.color === 'cyan' ? '[var(--color-cyan)]' : mode.color === 'magenta' ? '[var(--color-magenta)]' : '[var(--color-orange)]'} opacity-20 blur-xl rounded-full`} />
                  <div className="relative border-2 border-[var(--color-chrome)] p-4 transform rotate-45 group-hover:rotate-90 transition-transform duration-500 bg-black">
                    <Icon className={`w-8 h-8 transform -rotate-45 group-hover:-rotate-90 transition-transform duration-500 text-[var(--color-${mode.color === 'orange' ? 'orange' : mode.color === 'magenta' ? 'magenta' : 'cyan'})]`} />
                  </div>
                </div>

                <h2 className="font-heading text-2xl font-bold mb-4 text-[var(--color-chrome)] group-hover:text-[var(--color-cyan)] transition-colors">
                  {mode.title}
                </h2>

                <p className="font-mono text-[var(--color-chrome)]/60 text-sm leading-relaxed mb-8 flex-grow">
                  {mode.description}
                </p>

                <div className="w-full mt-auto">
                  <Button
                    variant={index === 1 ? 'secondary' : 'primary'}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModeSelect(mode.id);
                    }}
                  >
                    BAŞLAT
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-4 right-4 text-[var(--color-chrome)]/30 text-xs z-10 font-mono"
      >
        <p>SIS.VER.2.0.88 // GEMINI_CEKIRDEGI_TARAFINDAN_GUCLENDIRILDI</p>
      </motion.div>
    </main>
  );
}
