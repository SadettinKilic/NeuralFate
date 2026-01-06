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
                <Loader message="Generating your story..." size="lg" />
            </main>
        );
    }

    if (!storyData) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <Card variant="strong" className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-neon-red mb-4">Error Loading Story</h2>
                    <Button onClick={() => router.push('/')}>Return Home</Button>
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
                <div className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-electric-blue" />
                            <span className="text-cyber-white font-mono text-lg">{currentDilemma.time}</span>
                        </div>
                        <div className="text-cyber-white font-semibold">
                            {currentDilemma.player === 1 ? player1.name : (isVsAI ? 'AI Turn' : player2.name)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-midnight/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-electric-blue to-neon-red"
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
                    <Card variant="strong" className="p-8">
                        {/* Question */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl md:text-3xl font-bold mb-8 text-cyber-white leading-relaxed"
                        >
                            {currentDilemma.question}
                        </motion.h2>

                        {/* Countdown Timer */}
                        {!showingResult && (
                            <div className="mb-6 flex items-center justify-center">
                                <motion.div
                                    className="text-6xl font-bold text-glow"
                                    animate={{
                                        scale: countdown <= 3 ? [1, 1.1, 1] : 1,
                                        color: countdown <= 3 ? '#ff0844' : '#00d9ff'
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {countdown}
                                </motion.div>
                            </div>
                        )}

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <div className="flex flex-col items-start gap-2">
                                            <span className="font-bold">{option}</span>
                                            <span className="text-sm text-electric-blue/70 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
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
                                className="mt-6 glass-strong p-4 rounded-lg text-center"
                            >
                                <p className="text-electric-blue font-semibold">Choice Recorded</p>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
