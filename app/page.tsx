'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/lib/contexts/GameContext';
import { Monitor, Globe, Bot } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { setGameMode, setGamePhase, setIsVsAI } = useGame();
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);

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

  const handleStartGame = () => {
    if (!selectedModeId) return;

    setGameMode(selectedModeId as 'local' | 'online' | 'solo');
    setIsVsAI(selectedModeId === 'solo');
    setGamePhase('character');
    router.push(`/game/${selectedModeId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-12 z-10 relative"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full z-10 px-4 mb-12">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          const isSelected = selectedModeId === mode.id;

          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                variant={isSelected ? 'terminal' : 'default'}
                className={`
                  cursor-pointer group h-full flex flex-col items-center text-center relative overflow-visible transition-all duration-300
                  ${isSelected ? 'border-2 border-[var(--color-cyan)] shadow-[0_0_30px_rgba(0,255,255,0.3)] bg-black/80' : 'hover:border-[var(--color-magenta)]'}
                `}
                onClick={() => setSelectedModeId(mode.id)}
              >
                {/* Floating Icon Container */}
                <div className="mb-6 relative">
                  <div className={`absolute inset-0 bg-${mode.color === 'cyan' ? '[var(--color-cyan)]' : mode.color === 'magenta' ? '[var(--color-magenta)]' : '[var(--color-orange)]'} opacity-20 blur-xl rounded-full`} />
                  <div className={`relative border-2 p-4 transform rotate-45 transition-all duration-500 bg-black ${isSelected ? 'border-[var(--color-cyan)] rotate-0' : 'border-[var(--color-chrome)] group-hover:rotate-90'}`}>
                    <Icon className={`w-8 h-8 transition-transform duration-500 text-[var(--color-${mode.color === 'orange' ? 'orange' : mode.color === 'magenta' ? 'magenta' : 'cyan'})] ${isSelected ? 'transform rotate-0' : 'transform -rotate-45 group-hover:-rotate-90'}`} />
                  </div>
                </div>

                <h2 className={`font-heading text-2xl font-bold mb-4 transition-colors ${isSelected ? 'text-[var(--color-cyan)]' : 'text-[var(--color-chrome)] group-hover:text-[var(--color-cyan)]'}`}>
                  {mode.title}
                </h2>

                <p className="font-mono text-[var(--color-chrome)]/60 text-sm leading-relaxed mb-4 flex-grow">
                  {mode.description}
                </p>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 right-2 w-3 h-3 bg-[var(--color-cyan)] rounded-full shadow-[0_0_10px_cyan]"
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md px-4"
      >
        <Button
          variant="primary"
          className="w-full h-16 text-xl tracking-widest relative overflow-hidden"
          disabled={!selectedModeId}
          onClick={handleStartGame}
        >
          {selectedModeId ? 'SISTEMI_BASLAT' : 'MOD_SECINIZ'}
          {selectedModeId && <span className="absolute right-4 animate-pulse">_</span>}
        </Button>
      </motion.div>
    </main>
  );
}
