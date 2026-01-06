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
      title: 'Local Mode',
      description: 'Pass-the-phone experience for two players on one device',
      icon: Monitor,
      color: 'electric-blue'
    },
    {
      id: 'online',
      title: 'Online Multiplayer',
      description: 'Real-time synchronization with a friend on another device',
      icon: Globe,
      color: 'neural-purple'
    },
    {
      id: 'solo',
      title: 'Solo vs AI',
      description: 'Challenge the Neural Shadow AI opponent across difficulty modes',
      icon: Bot,
      color: 'neon-red'
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
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-glow relative">
          <span className="bg-gradient-to-r from-electric-blue via-neural-purple to-neon-red bg-clip-text text-transparent">
            NEURAL FATE
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-cyber-white/80 text-lg md:text-xl font-light tracking-wide"
        >
          Where mundane choices lead to murder
        </motion.p>
      </motion.div>

      {/* Mode selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full z-10">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
            >
              <Card
                variant="border"
                className="cursor-pointer hover:scale-105 transition-all duration-300 h-full flex flex-col"
                onClick={() => handleModeSelect(mode.id)}
              >
                <div className="flex flex-col items-center text-center gap-4 flex-grow">
                  {/* Icon */}
                  <div className={`p-4 rounded-full bg-${mode.color}/20 border-2 border-${mode.color}`}>
                    <Icon className={`w-12 h-12 text-${mode.color}`} />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-cyber-white">
                    {mode.title}
                  </h2>

                  {/* Description */}
                  <p className="text-cyber-white/70 text-sm leading-relaxed">
                    {mode.description}
                  </p>

                  {/* Button */}
                  <div className="mt-auto w-full">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModeSelect(mode.id);
                      }}
                    >
                      Select Mode
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-electric-blue rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-cyber-white/50 text-sm z-10"
      >
        <p className="font-mono">Powered by Gemini AI & Supabase</p>
      </motion.div>
    </main>
  );
}
