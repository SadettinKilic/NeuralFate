'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
    message?: string;
    className?: string;
}

export function Loader({ message = 'PROCESSING...', className }: LoaderProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
            {/* Vaporwave Triangle Spinner */}
            <div className="relative w-24 h-24">
                <motion.div
                    className="absolute inset-0 border-4 border-[var(--color-magenta)]"
                    style={{ borderRadius: '0%' }}
                    animate={{
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />
                <motion.div
                    className="absolute inset-2 border-4 border-[var(--color-cyan)]"
                    animate={{
                        rotate: [360, 180, 0],
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: Infinity
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-[var(--color-orange)] animate-pulse" />
                </div>
            </div>

            {/* Retro Loading Text */}
            {message && (
                <div className="font-mono text-[var(--color-cyan)] tracking-widest text-lg animate-pulse">
                    &gt; {message.toUpperCase()}<span className="inline-block w-2 h-4 bg-[var(--color-cyan)] ml-1 animate-pulse" />
                </div>
            )}
        </div>
    );
}
