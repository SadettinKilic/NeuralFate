'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { simulateAIResponse } from '@/lib/utils/ai-opponent';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
    question: string;
    targetPlayer: number;
    correctAnswer: string;
    options: string[];
    suspicionImpact: number;
    isCritical: boolean;
}

export default function InterrogationPage() {
    const router = useRouter();
    const {
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        difficulty,
        isVsAI
    } = useGame();

    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [countdown, setCountdown] = useState(15);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [strikes, setStrikes] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Load questions
    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const response = await fetch('/api/gemini/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player1Name: player1.name,
                    player2Name: isVsAI ? 'Neural Shadow' : player2.name,
                    player1Choices: player1.choices,
                    player2Choices: player2.choices
                })
            });

            if (!response.ok) throw new Error('Failed to generate questions');

            const data = await response.json();
            setQuestions(data.questions);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading questions:', error);
            setIsLoading(false);
        }
    };

    // Countdown timer
    useEffect(() => {
        if (isAnswered || gameOver) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            // Timeout - increase suspicion
            handleTimeout();
        }
    }, [countdown, isAnswered, gameOver]);

    const handleTimeout = () => {
        if (!questions[currentQuestionIndex]) return;

        const question = questions[currentQuestionIndex];
        const targetPlayer = question.targetPlayer;

        // Increase suspicion
        if (targetPlayer === 1) {
            const newSuspicion = Math.min(100, player1.suspicionLevel + Math.abs(question.suspicionImpact));
            setPlayer1({ ...player1, suspicionLevel: newSuspicion });

            // Vibration feedback
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }

            checkStrikes(newSuspicion, 1);
        }

        setIsAnswered(true);

        setTimeout(() => {
            nextQuestion();
        }, 3000);
    };

    const handleAnswer = (answer: string) => {
        if (isAnswered || gameOver) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        const question = questions[currentQuestionIndex];
        const isCorrect = answer === question.correctAnswer;
        const targetPlayer = question.targetPlayer;

        // Update suspicion
        if (targetPlayer === 1) {
            const change = isCorrect ? question.suspicionImpact : 0;
            const newSuspicion = Math.max(0, Math.min(100, player1.suspicionLevel + change));
            setPlayer1({ ...player1, suspicionLevel: newSuspicion });

            if (!isCorrect && question.isCritical) {
                const newStrikes = strikes + 1;
                setStrikes(newStrikes);
                checkStrikes(newSuspicion, 1, newStrikes);
            }
        } else if (targetPlayer === 2) {
            if (isVsAI) {
                // AI opponent answers
                setTimeout(() => {
                    const aiResponse = simulateAIResponse(
                        question.correctAnswer,
                        question.options,
                        difficulty
                    );
                    const change = aiResponse.isCorrect ? question.suspicionImpact : 0;
                    const newSuspicion = Math.max(0, Math.min(100, player2.suspicionLevel + change));
                    setPlayer2({ ...player2, suspicionLevel: newSuspicion });
                }, 1000);
            } else {
                const change = isCorrect ? question.suspicionImpact : 0;
                const newSuspicion = Math.max(0, Math.min(100, player2.suspicionLevel + change));
                setPlayer2({ ...player2, suspicionLevel: newSuspicion });

                if (!isCorrect && question.isCritical) {
                    const newStrikes = strikes + 1;
                    setStrikes(newStrikes);
                    checkStrikes(newSuspicion, 2, newStrikes);
                }
            }
        }

        setTimeout(() => {
            nextQuestion();
        }, 3000);
    };

    const checkStrikes = (suspicion: number, player: number, currentStrikes: number = strikes) => {
        if (suspicion >= 100 && currentStrikes >= 1) {
            setGameOver(true);
            // Player is arrested
            setTimeout(() => {
                router.push('/game/results');
            }, 3000);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCountdown(15);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            // All questions done
            setTimeout(() => {
                router.push('/game/results');
            }, 2000);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader message="SORGULAMA_BASLATILIYOR" size="lg" />
            </main>
        );
    }

    if (!questions.length) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <Card variant="terminal" className="p-8 text-center text-[var(--color-neon-red)]">
                    <h2 className="text-2xl font-bold font-heading mb-4">VERI_BOZULMASI</h2>
                    <Button onClick={() => router.push('/')}>SISTEM_SIFIRLAMA</Button>
                </Card>
            </main>
        );
    }

    if (gameOver) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card variant="terminal" className="p-12 text-center border-[var(--color-neon-red)]">
                        <XCircle className="w-24 h-24 text-[var(--color-neon-red)] mx-auto mb-6" />
                        <h2 className="text-5xl font-bold text-[var(--color-neon-red)] mb-4 text-glow font-heading">SUBJE_TUTUKLANDI</h2>
                        <p className="text-[var(--color-chrome)] text-lg font-mono">KRITIK_HATA_ESIGI_ASILDI</p>
                    </Card>
                </motion.div>
            </main>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Determine target player for display
    const targetPlayerName = currentQuestion.targetPlayer === 1
        ? player1.name
        : (isVsAI ? 'Neural Shadow' : player2.name);

    const targetSuspicion = currentQuestion.targetPlayer === 1
        ? player1.suspicionLevel
        : player2.suspicionLevel;

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Question Area */}
                <div className="lg:col-span-9">
                    <Card variant="terminal" className="p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4 font-mono">
                                <h3 className="text-[var(--color-cyan)] font-semibold tracking-wider">
                                    SORGU_SEKANSI {currentQuestionIndex + 1}/{questions.length}
                                </h3>
                                <div className="text-[var(--color-chrome)]">
                                    SUBJE: <span className="font-bold text-[var(--color-magenta)]">{targetPlayerName}</span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-black/50 h-2 overflow-hidden border border-[var(--color-border)]">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-magenta)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="flex items-center justify-center mb-8">
                            <motion.div
                                className="relative w-32 h-32"
                                animate={{
                                    scale: countdown <= 5 ? [1, 1.1, 1] : 1
                                }}
                                transition={{ duration: 0.5, repeat: countdown <= 5 ? Infinity : 0 }}
                            >
                                <svg className="transform -rotate-90 w-32 h-32">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="rgba(0, 255, 255, 0.1)"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <motion.circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke={countdown <= 5 ? 'var(--color-neon-red)' : 'var(--color-cyan)'}
                                        strokeWidth="4"
                                        fill="none"
                                        strokeLinecap="square"
                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                        initial={{ strokeDashoffset: 0 }}
                                        animate={{ strokeDashoffset: `${2 * Math.PI * 56 * (1 - countdown / 15)}` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-4xl font-bold font-mono text-glow-cyan">{countdown}</span>
                                    <span className="text-[10px] text-[var(--color-chrome)] font-mono tracking-widest">SN</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <h2 className="text-xl md:text-3xl font-bold mb-8 text-[var(--color-chrome)] text-center leading-relaxed font-heading">
                                    {currentQuestion.question}
                                </h2>

                                {/* Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option, index) => {
                                        const isCorrect = option === currentQuestion.correctAnswer;
                                        const isSelected = option === selectedAnswer;

                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Button
                                                    variant={
                                                        isAnswered && isSelected
                                                            ? isCorrect
                                                                ? 'primary'
                                                                : 'secondary' // Red highlight handled by style prop if needed or just variant logic
                                                            : 'outline'
                                                    }
                                                    className={`w-full h-auto py-5 relative ${isAnswered && isSelected ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                                                    onClick={() => handleAnswer(option)}
                                                    disabled={isAnswered}
                                                >
                                                    <span className="text-lg">{option}</span>
                                                    {isAnswered && isSelected && (
                                                        <span className="ml-2">
                                                            {isCorrect ? (
                                                                <CheckCircle2 className="w-5 h-5 inline text-[var(--color-cyan)]" />
                                                            ) : (
                                                                <XCircle className="w-5 h-5 inline text-[var(--color-neon-red)]" />
                                                            )}
                                                        </span>
                                                    )}
                                                </Button>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Critical warning */}
                                {currentQuestion.isCritical && !isAnswered && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-6 border border-[var(--color-orange)] bg-[rgba(255,153,0,0.1)] p-4 flex items-center justify-center gap-3"
                                    >
                                        <AlertCircle className="w-6 h-6 text-[var(--color-orange)] animate-pulse" />
                                        <p className="text-[var(--color-orange)] font-mono font-bold tracking-widest text-sm uppercase">
                                            KRITIK_VERI_NOKTASI // HATA_SONLANDIRMA_ILE_SONUCLANABILIR
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Card>
                </div>

                {/* Suspicion Meter Sidebar */}
                <div className="lg:col-span-3">
                    <Card variant="terminal" className="p-6 sticky top-4 h-full">
                        <h3 className="text-center font-heading text-lg mb-6 text-[var(--color-cyan)] uppercase">SUPHE_SEVIYESI</h3>

                        {/* Vertical meter */}
                        <div className="relative h-64 w-full flex items-center justify-center">
                            <div className="relative w-12 h-full bg-black rounded-sm overflow-hidden border border-[var(--color-border)]">
                                {/* Grid lines for meter */}
                                <div className="absolute inset-0 z-10 flex flex-col justify-between p-1 opacity-30">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-full h-px bg-[var(--color-cyan)]" />
                                    ))}
                                </div>

                                <motion.div
                                    className={`absolute bottom-0 w-full ${targetSuspicion < 30
                                        ? 'bg-gradient-to-t from-[var(--color-cyan)] to-blue-500'
                                        : targetSuspicion < 70
                                            ? 'bg-gradient-to-t from-[var(--color-orange)] to-yellow-400'
                                            : 'bg-gradient-to-t from-[var(--color-neon-red)] to-red-600'
                                        }`}
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: `${targetSuspicion}%`,
                                    }}
                                    transition={{ type: 'spring', damping: 15 }}
                                />
                            </div>

                            {/* Percentage label */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.span
                                    className="text-4xl font-bold font-mono text-glow bg-black/50 px-2"
                                    animate={{
                                        scale: targetSuspicion >= 80 ? [1, 1.1, 1] : 1,
                                        color: targetSuspicion >= 80 ? 'var(--color-neon-red)' : 'var(--color-chrome)'
                                    }}
                                    transition={{ duration: 0.5, repeat: targetSuspicion >= 80 ? Infinity : 0 }}
                                >
                                    {targetSuspicion}%
                                </motion.span>
                            </div>
                        </div>

                        {/* Strikes */}
                        <div className="mt-8 text-center border-t border-[var(--color-border)] pt-4">
                            <p className="text-[var(--color-chrome)] font-mono text-xs mb-3 tracking-widest">UYARILAR</p>
                            <div className="flex justify-center gap-2">
                                {[0, 1].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-6 h-6 border-2 border-[var(--color-neon-red)] ${i < strikes ? 'bg-[var(--color-neon-red)] shadow-[0_0_10px_red]' : 'bg-transparent'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-[var(--color-neon-red)] text-[10px] mt-2 font-mono uppercase">2 Uyarı = Sonlandırma</p>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
