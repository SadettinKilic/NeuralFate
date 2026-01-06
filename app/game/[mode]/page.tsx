'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Sparkles } from 'lucide-react';

const AVATARS = [
    { id: '1', name: 'Cyber Detective', prompt: 'Detective with cybernetic enhancements and trench coat' },
    { id: '2', name: 'Neural Hacker', prompt: 'Hacker with neural implants and neon glasses' },
    { id: '3', name: 'Street Runner', prompt: 'Street mercenary with tactical gear and mohawk' },
    { id: '4', name: 'Corporate Agent', prompt: 'Corporate agent in sleek suit with holographic display' },
    { id: '5', name: 'Tech Priestess', prompt: 'Tech priestess with data cables and glowing tattoos' },
    { id: '6', name: 'Void Wanderer', prompt: 'Mysterious figure with dark cloak and void energy' },
    { id: '7', name: 'Neon Samurai', prompt: 'Cyberpunk samurai with energy blade and armor' },
    { id: '8', name: 'Data Ghost', prompt: 'Ghostly hacker figure with transparent holographic body' },
];

const DIFFICULTY_OPTIONS = [
    {
        id: 'EASY',
        name: 'EASY',
        description: 'Dilemmas every 3-4 hours | Low interrogation pressure | AI makes frequent errors',
        color: 'green'
    },
    {
        id: 'MEDIUM',
        name: 'MEDIUM',
        description: 'Dilemmas every 2 hours | Medium pressure | AI is balanced',
        color: 'yellow'
    },
    {
        id: 'HARD',
        name: 'HARD',
        description: 'Dilemmas every hour | High pressure | AI nearly perfect',
        color: 'red'
    }
];

export default function GameModePage({ params }: { params: { mode: string } }) {
    const router = useRouter();
    const {
        gameMode,
        currentPlayer,
        setCurrentPlayer,
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        difficulty,
        setDifficulty,
        setGamePhase,
        isVsAI
    } = useGame();

    const [step, setStep] = useState<'player1' | 'player2' | 'difficulty'>('player1');
    const [tempName, setTempName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');
    const [error, setError] = useState('');

    const handleCharacterSubmit = () => {
        if (!tempName.trim()) {
            setError('Please enter a name');
            return;
        }
        if (!selectedAvatar) {
            setError('Please select an avatar');
            return;
        }

        const avatar = AVATARS.find(a => a.id === selectedAvatar)!;

        if (step === 'player1') {
            setPlayer1({
                ...player1,
                name: tempName.trim(),
                avatar: avatar.prompt
            });

            // If solo mode or online, go to difficulty
            // If local mode, go to player 2
            if (gameMode === 'solo' || gameMode === 'online') {
                setStep('difficulty');
            } else {
                setStep('player2');
                setTempName('');
                setSelectedAvatar('');
                setError('');
            }
        } else if (step === 'player2') {
            setPlayer2({
                ...player2,
                name: tempName.trim(),
                avatar: avatar.prompt
            });
            setStep('difficulty');
        }
    };

    const handleDifficultySubmit = () => {
        setGamePhase('day');
        router.push('/game/play');
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
            >
                {step !== 'difficulty' ? (
                    // Character Creation
                    <Card variant="strong" className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-8 h-8 text-electric-blue" />
                            <h2 className="text-3xl font-bold text-glow">
                                {step === 'player1' ? 'Player 1' : 'Player 2'} - Create Character
                            </h2>
                        </div>

                        {/* Name Input */}
                        <div className="mb-8">
                            <Input
                                label="Character Name"
                                placeholder="Enter your name..."
                                value={tempName}
                                onChange={(e) => {
                                    setTempName(e.target.value);
                                    setError('');
                                }}
                                error={error && !tempName ? error : ''}
                                maxLength={20}
                            />
                        </div>

                        {/* Avatar Selection */}
                        <div className="mb-8">
                            <label className="text-cyber-white text-sm font-medium mb-4 block">
                                Select Avatar
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {AVATARS.map((avatar) => (
                                    <motion.div
                                        key={avatar.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div
                                            className={`
                        glass p-4 rounded-lg cursor-pointer transition-all duration-300
                        border-2 ${selectedAvatar === avatar.id
                                                    ? 'border-electric-blue shadow-[0_0_20px_rgba(0,217,255,0.5)]'
                                                    : 'border-transparent hover:border-electric-blue/50'
                                                }
                      `}
                                            onClick={() => {
                                                setSelectedAvatar(avatar.id);
                                                setError('');
                                            }}
                                        >
                                            <div className="aspect-square bg-midnight/50 rounded-lg mb-2 flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-electric-blue/50" />
                                            </div>
                                            <p className="text-cyber-white text-xs text-center font-medium">
                                                {avatar.name}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {error && !selectedAvatar && (
                                <p className="text-neon-red text-sm mt-2">{error}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={handleCharacterSubmit}
                        >
                            {step === 'player1' && gameMode === 'local' ? 'Next: Player 2' : 'Continue'}
                        </Button>
                    </Card>
                ) : (
                    // Difficulty Selection
                    <Card variant="strong" className="p-8">
                        <h2 className="text-3xl font-bold text-glow mb-6">Select Difficulty</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {DIFFICULTY_OPTIONS.map((diff) => (
                                <motion.div
                                    key={diff.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div
                                        className={`
                      glass p-6 rounded-lg cursor-pointer transition-all duration-300
                      border-2 ${difficulty === diff.id
                                                ? 'border-electric-blue shadow-[0_0_20px_rgba(0,217,255,0.5)]'
                                                : 'border-transparent hover:border-electric-blue/50'
                                            }
                    `}
                                        onClick={() => setDifficulty(diff.id as any)}
                                    >
                                        <h3 className="text-xl font-bold mb-2 text-cyber-white">{diff.name}</h3>
                                        <p className="text-cyber-white/70 text-sm leading-relaxed">
                                            {diff.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Player Info Summary */}
                        <div className="glass p-4 rounded-lg mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-electric-blue font-semibold mb-1">Player 1</p>
                                    <p className="text-cyber-white">{player1.name}</p>
                                </div>
                                {gameMode === 'local' && (
                                    <div>
                                        <p className="text-neural-purple font-semibold mb-1">Player 2</p>
                                        <p className="text-cyber-white">{player2.name}</p>
                                    </div>
                                )}
                                {isVsAI && (
                                    <div>
                                        <p className="text-neon-red font-semibold mb-1">AI Opponent</p>
                                        <p className="text-cyber-white">Neural Shadow</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={handleDifficultySubmit}
                        >
                            Start Game
                        </Button>
                    </Card>
                )}
            </motion.div>
        </main>
    );
}
