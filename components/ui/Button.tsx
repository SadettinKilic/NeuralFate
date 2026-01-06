'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Lock } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    isLocked?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    isLocked = false,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) {
    const baseClasses = 'relative font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group';

    const variantClasses = {
        primary: 'glass neon-border text-electric-100 hover:bg-electric-blue/20',
        secondary: 'glass border border-cyber-white/30 text-cyber-white hover:border-electric-blue/50',
        danger: 'glass neon-border-red text-neon-red hover:bg-neon-red/20',
        ghost: 'bg-transparent border-none text-cyber-white hover:bg-white/10'
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm min-h-[40px]',
        md: 'px-6 py-3 text-base min-h-[48px]',
        lg: 'px-8 py-4 text-lg min-h-[56px]'
    };

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                (disabled || isLoading || isLocked) && 'opacity-50 cursor-not-allowed',
                className
            )}
            disabled={disabled || isLoading || isLocked}
            {...props}
        >
            {/* Ripple effect background */}
            <span className="absolute inset-0 bg-electric-blue/20 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {isLocked && <Lock className="w-4 h-4" />}
                {isLoading ? (
                    <span className="loading-spinner" />
                ) : (
                    children
                )}
            </span>
        </button>
    );
}
