'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Sparkles, AlertCircle } from 'lucide-react';

const AVATARS = [
    { id: '1', name: 'Siber Dedektif', prompt: 'Detective with cybernetic enhancements and trench coat' },
    { id: '2', name: 'Nöral Hacker', prompt: 'Hacker with neural implants and neon glasses' },
    { id: '3', name: 'Sokak Koşucusu', prompt: 'Street mercenary with tactical gear and mohawk' },
    { id: '4', name: 'Şirket Ajanı', prompt: 'Corporate agent in sleek suit with holographic display' },
    { id: '5', name: 'Tekno Rahibe', prompt: 'Tech priestess with data cables and glowing tattoos' },
    { id: '6', name: 'Boşluk Gezgini', prompt: 'Mysterious figure with dark cloak and void energy' },
    { id: '7', name: 'Neon Samuray', prompt: 'Cyberpunk samurai with energy blade and armor' },
    { id: '8', name: 'Veri Hayaleti', prompt: 'Ghostly hacker figure with transparent holographic body' },
];

const DIFFICULTY_OPTIONS = [
    {
        id: 'EASY',
        name: 'KOLAY',
        description: 'Her 3-4 saatte bir ikilem | Düşük sorgulama baskısı | Yapay Zeka sık hata yapar',
        color: 'green'
    },
    {
        id: 'MEDIUM',
        name: 'ORTA',
        description: 'Her 2 saatte bir ikilem | Orta seviye baskı | Yapay Zeka dengelidir',
        color: 'yellow'
    },
    {
        id: 'HARD',
        name: 'ZOR',
        description: 'Her saat başı ikilem | Yüksek baskı | Yapay Zeka neredeyse kusursuzdur',
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
            setError('Lütfen bir isim giriniz');
            return;
        }
        if (!selectedAvatar) {
            setError('Lütfen bir avatar seçiniz');
            return;
        }

        const avatar = AVATARS.find(a => a.id === selectedAvatar)!;

        // ... rest of the logic
        if (step === 'player1') {
            setPlayer1({
                ...player1,
                name: tempName.trim(),
                avatar: avatar.prompt
            });

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
                    <Card variant="terminal" className="p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-magenta)] pb-4">
                            <User className="w-6 h-6 text-[var(--color-cyan)]" />
                            <h2 className="font-heading text-2xl text-[var(--color-cyan)] uppercase tracking-wider">
                                {step === 'player1' ? 'OYUNCU 1' : 'OYUNCU 2'} // BAŞLATILIYOR
                            </h2>
                        </div>

                        {/* Name Input */}
                        <div className="mb-8">
                            <Input
                                label="KIMLIK_DIZISI"
                                placeholder="Takma ad giriniz..."
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
                            <label className="text-[var(--color-cyan)] text-sm font-mono tracking-widest uppercase mb-4 block">
                                &gt; AVATAR_SEC
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
                        glass p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group
                        ${selectedAvatar === avatar.id
                                                    ? 'border-2 border-[var(--color-cyan)] shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                                                    : 'border border-[var(--color-border)] hover:border-[var(--color-magenta)]'
                                                }
                      `}
                                            onClick={() => {
                                                setSelectedAvatar(avatar.id);
                                                setError('');
                                            }}
                                        >
                                            {selectedAvatar === avatar.id && (
                                                <div className="absolute inset-0 bg-[var(--color-cyan)] opacity-10" />
                                            )}

                                            <div className="aspect-square bg-black/50 mb-3 flex items-center justify-center border border-[var(--color-border)] group-hover:border-[var(--color-magenta)] transition-colors">
                                                <Sparkles className={`w-8 h-8 ${selectedAvatar === avatar.id ? 'text-[var(--color-cyan)]' : 'text-[var(--color-magenta)]'} group-hover:animate-spin`} />
                                            </div>
                                            <p className="text-[var(--color-chrome)] text-xs text-center font-mono uppercase tracking-tight">
                                                {avatar.name}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {error && !selectedAvatar && (
                                <p className="text-[var(--color-neon-red)] text-sm mt-3 font-mono flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={handleCharacterSubmit}
                        >
                            {step === 'player1' && gameMode === 'local' ? 'OYUNCU 2 BASLATILIYOR' : 'KIMLIGI ONAYLA'}
                        </Button>
                    </Card>
                ) : (
                    // Difficulty Selection
                    <Card variant="terminal" className="p-8">
                        <h2 className="font-heading text-2xl text-[var(--color-cyan)] uppercase tracking-wider mb-8 border-b border-[var(--color-magenta)] pb-4">
                            ZORLUK_SEVIYESI_SEC
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {DIFFICULTY_OPTIONS.map((diff) => (
                                <motion.div
                                    key={diff.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div
                                        className={`
                      glass p-6 cursor-pointer transition-all duration-300 h-full flex flex-col
                      ${difficulty === diff.id
                                                ? 'border-2 border-[var(--color-cyan)] shadow-[0_0_20px_rgba(0,255,255,0.4)] bg-[rgba(0,255,255,0.05)]'
                                                : 'border border-[var(--color-border)] hover:border-[var(--color-magenta)]'
                                            }
                    `}
                                        onClick={() => setDifficulty(diff.id as any)}
                                    >
                                        <h3 className={`text-xl font-bold mb-2 font-heading ${difficulty === diff.id ? 'text-[var(--color-cyan)]' : 'text-[var(--color-chrome)]'}`}>
                                            {diff.name}
                                        </h3>
                                        <p className="text-[var(--color-chrome)]/70 text-sm leading-relaxed font-mono">
                                            {diff.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Player Info Summary */}
                        <div className="border border-[var(--color-border)] bg-black/40 p-4 mb-8 font-mono text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[var(--color-cyan)] mb-1 uppercase text-xs tracking-widest">OYUNCU 1</p>
                                    <p className="text-[var(--color-chrome)] border-b border-[var(--color-border)] pb-1">{player1.name}</p>
                                </div>
                                {gameMode === 'local' && (
                                    <div>
                                        <p className="text-[var(--color-magenta)] mb-1 uppercase text-xs tracking-widest">OYUNCU 2</p>
                                        <p className="text-[var(--color-chrome)] border-b border-[var(--color-border)] pb-1">{player2.name}</p>
                                    </div>
                                )}
                                {isVsAI && (
                                    <div>
                                        <p className="text-[var(--color-orange)] mb-1 uppercase text-xs tracking-widest">RAKIP</p>
                                        <p className="text-[var(--color-chrome)] border-b border-[var(--color-border)] pb-1">NEURAL_SHADOW_YAPAY_ZEKA</p>
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
                            OYUN_SEKANSINI_BASLAT
                        </Button>
                    </Card>
                )}
            </motion.div>
        </main>
    );
}
