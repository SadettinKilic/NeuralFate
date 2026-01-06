'use client';

import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-cyber-white text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                className={cn(
                    'w-full px-4 py-3 rounded-lg',
                    'bg-midnight/50 border border-electric-blue/30',
                    'text-cyber-white placeholder-cyber-white/40',
                    'focus:outline-none focus:border-electric-blue focus:shadow-[0_0_20px_rgba(0,217,255,0.3)]',
                    'transition-all duration-300',
                    'min-h-[48px]',
                    error && 'border-neon-red focus:border-neon-red',
                    className
                )}
                {...props}
            />

            {error && (
                <p className="text-neon-red text-sm">{error}</p>
            )}
        </div>
    );
}
