'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, AlertTriangle, Star } from 'lucide-react';
import { saveScenario } from '@/lib/utils/supabase';

export default function ResultsPage() {
    const router = useRouter();
    const {
        player1,
        player2,
        convergenceLocation,
        difficulty,
        isVsAI
    } = useGame();

    const [rating, setRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Determine winner (lowest suspicion wins)
    const player1Suspicion = player1.suspicionLevel;
    const player2Suspicion = player2.suspicionLevel;
    const winner = player1Suspicion < player2Suspicion ? 1 : 2;
    const winnerName = winner === 1 ? player1.name : (isVsAI ? 'Neural Shadow' : player2.name);

    // Get killer info
    const killerPlayer = player1.isKiller ? 1 : 2;
    const killerName = killerPlayer === 1 ? player1.name : (isVsAI ? 'Neural Shadow' : player2.name);

    const handleRating = async (stars: number) => {
        setRating(stars);
        setHasRated(true);

        if (stars >= 3) {
            setIsSaving(true);
            try {
                // Save scenario to database
                await saveScenario(
                    difficulty,
                    convergenceLocation || 'Unknown Location',
                    [], // Dilemmas would be saved from context
                    [], // Questions would be saved from context
                    stars
                );
            } catch (error) {
                console.error('Error saving scenario:', error);
            }
            setIsSaving(false);
        }
    };

    const handlePlayAgain = () => {
        // Reset game state
        window.location.href = '/';
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-6">
                {/* Winner Announcement */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                >
                    <Card variant="terminal" className="p-12 text-center relative overflow-hidden">
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-red-900/20 animate-pulse" />

                        <div className="relative z-10">
                            <Trophy className="w-24 h-24 text-[var(--color-orange)] mx-auto mb-6" />
                            <h1 className="text-5xl font-bold mb-4 text-glow bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-orange)] bg-clip-text text-transparent font-heading">
                                CASE CLOSED
                            </h1>
                            <p className="text-3xl text-[var(--color-chrome)] mb-2 font-mono">
                                WINNER: <span className="font-bold text-[var(--color-cyan)]">{winnerName}</span>
                            </p>
                        </div>
                    </Card>
                </motion.div>

                {/* Suspicion Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card variant="terminal" className="p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center font-heading text-[var(--color-chrome)]">FINAL_SUSPICION_METRICS</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Player 1 */}
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-cyan)] font-mono tracking-widest">{player1.name}</h3>
                                <div className="relative h-48 flex items-end justify-center">
                                    <div className="w-24 bg-black/50 rounded-t-sm overflow-hidden border border-[var(--color-cyan)]">
                                        <motion.div
                                            className={`w-full ${player1Suspicion < 30
                                                ? 'bg-gradient-to-t from-[var(--color-cyan)] to-blue-500'
                                                : player1Suspicion < 70
                                                    ? 'bg-gradient-to-t from-[var(--color-orange)] to-yellow-400'
                                                    : 'bg-gradient-to-t from-[var(--color-neon-red)] to-red-600'
                                                }`}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(player1Suspicion / 100) * 12}rem` }}
                                            transition={{ type: 'spring', damping: 20, delay: 0.5 }}
                                        />
                                    </div>
                                </div>
                                <p className="text-4xl font-bold mt-4 text-glow font-mono text-[var(--color-chrome)]">{player1Suspicion}%</p>
                            </div>

                            {/* Player 2 */}
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-4 text-[var(--color-magenta)] font-mono tracking-widest">
                                    {isVsAI ? 'Neural Shadow' : player2.name}
                                </h3>
                                <div className="relative h-48 flex items-end justify-center">
                                    <div className="w-24 bg-black/50 rounded-t-sm overflow-hidden border border-[var(--color-magenta)]">
                                        <motion.div
                                            className={`w-full ${player2Suspicion < 30
                                                ? 'bg-gradient-to-t from-[var(--color-cyan)] to-blue-500'
                                                : player2Suspicion < 70
                                                    ? 'bg-gradient-to-t from-[var(--color-orange)] to-yellow-400'
                                                    : 'bg-gradient-to-t from-[var(--color-neon-red)] to-red-600'
                                                }`}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(player2Suspicion / 100) * 12}rem` }}
                                            transition={{ type: 'spring', damping: 20, delay: 0.7 }}
                                        />
                                    </div>
                                </div>
                                <p className="text-4xl font-bold mt-4 text-glow font-mono text-[var(--color-chrome)]">{player2Suspicion}%</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Killer Reveal */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card variant="terminal" className="p-8 border-2 border-[var(--color-neon-red)]">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-12 h-12 text-[var(--color-neon-red)] flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-[var(--color-neon-red)] font-heading uppercase tracking-widest">Truth Revealed</h2>
                                <p className="text-[var(--color-chrome)] text-lg mb-4 font-mono">
                                    PERPETRATOR: <span className="font-bold text-[var(--color-neon-red)] text-glow">{killerName}</span>
                                </p>
                                <p className="text-[var(--color-chrome)]/80">
                                    Both suspects were present at <span className="font-semibold text-[var(--color-cyan)]">{convergenceLocation}</span> at the time of the murder.
                                    Through seemingly mundane choices throughout the day, {killerName} unknowingly became entangled in a web of circumstance
                                    that led to this tragic outcome.
                                </p>
                                <p className="text-[var(--color-chrome)]/60 mt-4 text-sm italic font-mono">
                                    // IN NEURAL FATE, EVERY CHOICE MATTERS. Even the ordinary ones.
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Scenario Rating */}
                {!hasRated ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <Card variant="default" className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-cyan)] font-heading">RATE_SIMULATION</h2>
                            <p className="text-[var(--color-chrome)]/80 text-center mb-6 font-mono text-sm">
                                &gt; Help us improve. Scenarios rated 3+ are archived for future training data.
                            </p>

                            <div className="flex justify-center gap-4 mb-6">
                                {[1, 2, 3, 4, 5].map((stars) => (
                                    <motion.button
                                        key={stars}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleRating(stars)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-12 h-12 ${stars <= rating
                                                ? 'fill-[var(--color-orange)] text-[var(--color-orange)]'
                                                : 'text-[var(--color-chrome)]/30'
                                                }`}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card variant="terminal" className="p-8 text-center bg-black/80">
                            <h3 className="text-xl font-bold text-[var(--color-cyan)] mb-2 font-mono">
                                {isSaving ? 'ARCHIVING_DATA...' : 'FEEDBACK_ACKNOWLEDGED'}
                            </h3>
                            <p className="text-[var(--color-chrome)]/70 font-mono text-sm">
                                {rating >= 3
                                    ? 'SCENARIO_ARCHIVED_FOR_FUTURE_USE'
                                    : 'DATA_DISCARDED. THANK_YOU.'}
                            </p>
                        </Card>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Button
                        variant="primary"
                        className="flex-1"
                        size="lg"
                        onClick={handlePlayAgain}
                    >
                        REBOOT_SYSTEM
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex-1"
                        size="lg"
                        onClick={() => router.push('/')}
                    >
                        TERMINATE_SESSION
                    </Button>
                </motion.div>
            </div>
        </main>
    );
}
