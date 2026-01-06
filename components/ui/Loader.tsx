'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Loader({ message = 'Neural Analysis In Progress...', size = 'md' }: LoaderProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-8">
            {/* Rotating ring */}
            <div className="relative">
                <motion.div
                    className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-electric-blue border-r-neon-red`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />

                {/* Pulsing center dot */}
                <motion.div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${dotSizes[size]} rounded-full bg-electric-blue`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </div>

            {/* Animated message text */}
            {message && (
                <motion.p
                    className="text-cyber-white text-center font-mono text-sm"
                    animate={{
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {message}
                </motion.p>
            )}

            {/* Loading dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-electric-blue"
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
