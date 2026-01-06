'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Clock, MapPin } from 'lucide-react';

interface Dilemma {
    time: string;
    player: number;
    question: string;
    options: string[];
    locations: string[];
}

interface StoryData {
    convergenceLocation: string;
    dilemmas: Dilemma[];
    killerPlayer: number;
    finalExplanation: string;
}

export default function GamePlayPage() {
    const router = useRouter();
    const {
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        difficulty,
        currentPlayer,
        setCurrentPlayer,
        currentTime,
        setCurrentTime,
        setConvergenceLocation,
        gameMode,
        isVsAI
    } = useGame();

    const [isLoading, setIsLoading] = useState(true);
    const [storyData, setStoryData] = useState<StoryData | null>(null);
    const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
    const [showingResult, setShowingResult] = useState(false);
    const [countdown, setCountdown] = useState(10);

    // Load story on mount
    useEffect(() => {
        loadStory();
    }, []);

    const loadStory = async () => {
        try {
            const response = await fetch('/api/gemini/generate-story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player1Name: player1.name,
                    player2Name: isVsAI ? 'Neural Shadow' : player2.name,
                    player1Avatar: player1.avatar,
                    player2Avatar: isVsAI ? 'Advanced AI agent with neural implants' : player2.avatar,
                    difficulty
                })
            });

            if (!response.ok) throw new Error('Failed to generate story');

            const data = await response.json();
            setStoryData(data);
            setConvergenceLocation(data.convergenceLocation);

            // Set killer
            const updatedP1 = { ...player1, isKiller: data.killerPlayer === 1 };
            const updatedP2 = { ...player2, isKiller: data.killerPlayer === 2 };
            setPlayer1(updatedP1);
            setPlayer2(updatedP2);

            setIsLoading(false);
        } catch (error) {
            console.error('Error loading story:', error);
            setIsLoading(false);
        }
    };

    // Countdown timer for dilemma
    useEffect(() => {
        if (showingResult) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Auto-select first option on timeout
            handleChoice(0);
        }
    }, [countdown, showingResult]);

    const handleChoice = (optionIndex: number) => {
        if (!storyData || showingResult) return;

        const currentDilemma = storyData.dilemmas[currentDilemmaIndex];
        const choice = {
            time: currentDilemma.time,
            question: currentDilemma.question,
            selected: currentDilemma.options[optionIndex],
            location: currentDilemma.locations[optionIndex]
        };

        // Update current player's choices
        if (currentDilemma.player === 1) {
            setPlayer1({
                ...player1,
                choices: [...player1.choices, choice]
            });
        } else {
            setPlayer2({
                ...player2,
                choices: [...player2.choices, choice]
            });
        }

        setShowingResult(true);

        // Move to next dilemma after 2 seconds
        setTimeout(() => {
            if (currentDilemmaIndex < storyData.dilemmas.length - 1) {
                setCurrentDilemmaIndex(currentDilemmaIndex + 1);
                setCurrentTime(storyData.dilemmas[currentDilemmaIndex + 1].time);
                setShowingResult(false);
                setCountdown(10);

                // In local mode, switch player
                if (gameMode === 'local') {
                    const nextPlayer = storyData.dilemmas[currentDilemmaIndex + 1].player;
                    setCurrentPlayer(nextPlayer);
                }
            } else {
                // All dilemmas complete, go to interrogation
                setTimeout(() => {
                    router.push('/game/interrogation');
                }, 2000);
            }
        }, 2000);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader message="HIKAYE_OLUSTURULUYOR" size="lg" />
            </main>
        );
    }

    if (!storyData) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <Card variant="terminal" className="p-8 text-center border-[var(--color-neon-red)]">
                    <h2 className="font-heading text-2xl font-bold text-[var(--color-neon-red)] mb-4">SISTEM_HATASI</h2>
                    <Button variant="outline" onClick={() => router.push('/')}>GOREVI_IPTAL_ET</Button>
                </Card>
            </main>
        );
    }

    const currentDilemma = storyData.dilemmas[currentDilemmaIndex];
    const progress = ((currentDilemmaIndex + 1) / storyData.dilemmas.length) * 100;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="w-full max-w-4xl mb-6">
                <div className="glass p-4">
                    <div className="flex items-center justify-between mb-4 font-mono">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--color-cyan)]" />
                            <span className="text-[var(--color-chrome)] text-lg tracking-widest">{currentDilemma.time}</span>
                        </div>
                        <div className="text-[var(--color-magenta)] font-semibold uppercase tracking-wider">
                            {currentDilemma.player === 1 ? player1.name : (isVsAI ? 'YZ_SIRASI' : player2.name)} // EYLEM_GEREKLI
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/50 h-2 overflow-hidden border border-[var(--color-border)]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-magenta)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* Dilemma Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentDilemmaIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="w-full max-w-4xl"
                >
                    <Card variant="terminal" className="p-8">
                        {/* Question */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-xl md:text-3xl font-bold mb-8 text-[var(--color-chrome)] leading-relaxed text-center"
                        >
                            {currentDilemma.question}
                        </motion.h2>

                        {/* Countdown Timer */}
                        {!showingResult && (
                            <div className="mb-8 flex items-center justify-center">
                                <motion.div
                                    className="text-6xl font-bold font-mono tracking-tighter"
                                    animate={{
                                        scale: countdown <= 3 ? [1, 1.1, 1] : 1,
                                        color: countdown <= 3 ? 'var(--color-neon-red)' : 'var(--color-cyan)',
                                        textShadow: countdown <= 3 ? '0 0 20px red' : '0 0 20px cyan'
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    00:{countdown.toString().padStart(2, '0')}
                                </motion.div>
                            </div>
                        )}

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentDilemma.options.map((option, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <Button
                                        variant="primary"
                                        className="w-full h-auto py-6 text-lg"
                                        onClick={() => handleChoice(index)}
                                        disabled={showingResult}
                                    >
                                        <div className="flex flex-col items-start gap-2 w-full">
                                            <span className="font-bold text-left">{option}</span>
                                            <span className="text-xs text-[var(--color-chrome)]/70 flex items-center gap-1 font-mono uppercase">
                                                <MapPin className="w-3 h-3" />
                                                {currentDilemma.locations[index]}
                                            </span>
                                        </div>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Result feedback */}
                        {showingResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 border border-[var(--color-cyan)] bg-[rgba(0,255,255,0.1)] p-4 text-center"
                            >
                                <p className="text-[var(--color-cyan)] font-mono tracking-widest">VERI_KAYDEDILDI</p>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
