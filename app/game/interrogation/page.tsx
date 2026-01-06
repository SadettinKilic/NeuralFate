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
                <Loader message="Preparing interrogation..." size="lg" />
            </main>
        );
    }

    if (!questions.length) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <Card variant="strong" className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-neon-red mb-4">Error Loading Questions</h2>
                    <Button onClick={() => router.push('/')}>Return Home</Button>
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
                    <Card variant="strong" className="p-12 text-center">
                        <XCircle className="w-24 h-24 text-neon-red mx-auto mb-6" />
                        <h2 className="text-4xl font-bold text-neon-red mb-4 text-glow">ARRESTED</h2>
                        <p className="text-cyber-white/80 text-lg">Too many critical errors. Suspicion level: 100%</p>
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
                    <Card variant="strong" className="p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-electric-blue font-semibold">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </h3>
                                <span className="text-cyber-white">
                                    Interrogating: <span className="font-bold">{targetPlayerName}</span>
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-midnight/50 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-electric-blue to-neon-red"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="flex items-center justify-center mb-8">
                            <motion.div
                                className="relative w-24 h-24"
                                animate={{
                                    scale: countdown <= 5 ? [1, 1.1, 1] : 1
                                }}
                                transition={{ duration: 0.5, repeat: countdown <= 5 ? Infinity : 0 }}
                            >
                                <svg className="transform -rotate-90 w-24 h-24">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="rgba(0, 217, 255, 0.2)"
                                        strokeWidth="6"
                                        fill="none"
                                    />
                                    <motion.circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke={countdown <= 5 ? '#ff0844' : '#00d9ff'}
                                        strokeWidth="6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - countdown / 15)}`}
                                        initial={{ strokeDashoffset: 0 }}
                                        animate={{ strokeDashoffset: `${2 * Math.PI * 40 * (1 - countdown / 15)}` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-glow">{countdown}</span>
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
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-cyber-white text-center leading-relaxed">
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
                                                                : 'danger'
                                                            : 'secondary'
                                                    }
                                                    className={`w-full h-auto py-4 relative ${isAnswered && isSelected ? 'ring-2 ring-offset-2' : ''
                                                        }`}
                                                    onClick={() => handleAnswer(option)}
                                                    disabled={isAnswered}
                                                >
                                                    <span className="text-lg">{option}</span>
                                                    {isAnswered && isSelected && (
                                                        <span className="ml-2">
                                                            {isCorrect ? (
                                                                <CheckCircle2 className="w-5 h-5 inline text-electric-blue" />
                                                            ) : (
                                                                <XCircle className="w-5 h-5 inline text-neon-red" />
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
                                        className="mt-6 glass-strong p-4 rounded-lg flex items-center gap-3 border border-warning-yellow/50"
                                    >
                                        <AlertCircle className="w-6 h-6 text-warning-yellow" />
                                        <p className="text-warning-yellow font-semibold">
                                            CRITICAL QUESTION - Wrong answer may result in arrest
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </Card>
                </div>

                {/* Suspicion Meter Sidebar */}
                <div className="lg:col-span-3">
                    <Card variant="strong" className="p-6 sticky top-4">
                        <h3 className="text-center font-bold mb-6 text-cyber-white">Suspicion Level</h3>

                        {/* Vertical meter */}
                        <div className="relative h-80 w-full flex items-center justify-center">
                            <div className="relative w-16 h-full bg-midnight/50 rounded-full overflow-hidden border-2 border-electric-blue/30">
                                <motion.div
                                    className={`absolute bottom-0 w-full rounded-full ${targetSuspicion < 30
                                            ? 'bg-gradient-to-t from-green-500 to-green-400'
                                            : targetSuspicion < 70
                                                ? 'bg-gradient-to-t from-warning-yellow to-yellow-400'
                                                : 'bg-gradient-to-t from-neon-red to-red-500'
                                        }`}
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: `${targetSuspicion}%`,
                                    }}
                                    transition={{ type: 'spring', damping: 15 }}
                                />

                                {/* Pulse effect */}
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    animate={{ opacity: [0, 0.3, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>

                            {/* Percentage label */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.span
                                    className="text-4xl font-bold text-glow"
                                    animate={{
                                        scale: targetSuspicion >= 80 ? [1, 1.1, 1] : 1
                                    }}
                                    transition={{ duration: 0.5, repeat: targetSuspicion >= 80 ? Infinity : 0 }}
                                >
                                    {targetSuspicion}%
                                </motion.span>
                            </div>
                        </div>

                        {/* Strikes */}
                        <div className="mt-6 text-center">
                            <p className="text-cyber-white/70 text-sm mb-2">Strikes</p>
                            <div className="flex justify-center gap-2">
                                {[0, 1].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-full ${i < strikes ? 'bg-neon-red' : 'bg-cyber-white/20'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-neon-red text-xs mt-2">2 strikes = Arrested</p>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
