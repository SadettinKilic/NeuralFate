'use client';

import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'terminal' | 'file';
    animate?: boolean;
    children: React.ReactNode;
}

export function Card({
    variant = 'default',
    animate = true,
    className,
    children,
    ...props
}: CardProps) {
    // Vaporwave Card Styles
    const variantClasses = {
        // Standard Glass Panel with Cyan Laser Top Border
        default: 'glass p-6 md:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]',

        // Terminal Window Style (Black bg, full borders)
        terminal: 'bg-black/90 border-2 border-[var(--color-cyan)] shadow-[0_0_20px_rgba(0,255,255,0.2)]',

        // File Explorer / Less intense style
        file: 'bg-[rgba(26,16,60,0.9)] border-2 border-[rgba(224,224,224,0.2)] backdrop-blur'
    };

    return (
        <div
            className={cn(
                variantClasses[variant],
                animate && 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]',
                className
            )}
            {...props}
        >
            {/* Terminal Window Header Chips (Decorative) */}
            {variant === 'terminal' && (
                <div className="bg-[rgba(0,255,255,0.1)] border-b border-[var(--color-cyan)] px-4 py-2 mb-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF00FF]" />
                    <div className="w-3 h-3 rounded-full bg-[#00FFFF]" />
                    <div className="w-3 h-3 rounded-full bg-[#FF9900]" />
                </div>
            )}

            {children}
        </div>
    );
}
