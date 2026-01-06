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
                <label className="text-[var(--color-cyan)] text-sm font-mono tracking-widest uppercase">
                    &gt; {label}
                </label>
            )}

            <div className="relative">
                <input
                    className={cn(
                        'w-full px-3 py-3 font-mono text-lg bg-black/80',
                        'border-b-2 border-[var(--color-magenta)] border-t-0 border-x-0 rounded-none',
                        'text-[var(--color-cyan)] placeholder-[var(--color-magenta)]/50',
                        'focus:outline-none focus:border-[var(--color-cyan)] focus:shadow-[0_4px_10px_rgba(0,255,255,0.2)]',
                        'transition-all duration-300',
                        'autofill:bg-black autofill:text-[var(--color-cyan)]',
                        error && 'border-[var(--color-neon-red)] focus:border-[var(--color-neon-red)]',
                        className
                    )}
                    {...props}
                />
                {/* Blinking cursor effect could go here if implemented as custom element, 
                    but native input caret is fine for now. */}
            </div>

            {error && (
                <p className="text-[var(--color-neon-red)] text-sm font-mono mt-1">
                    [ERROR]: {error}
                </p>
            )}
        </div>
    );
}
