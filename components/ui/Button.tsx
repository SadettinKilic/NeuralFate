'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Lock } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
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
    const baseClasses = 'relative font-mono font-bold tracking-wider uppercase transition-all duration-200 transform -skew-x-12 flex items-center justify-center group';

    const variantClasses = {
        primary: 'bg-transparent border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black hover:shadow-[0_0_20px_var(--color-cyan)] hover:skew-x-0',
        secondary: 'bg-[var(--color-magenta)] border-2 border-[var(--color-magenta)] text-white hover:opacity-80 hover:scale-105 hover:skew-x-0',
        outline: 'bg-transparent border-2 border-[var(--color-magenta)] text-[var(--color-magenta)] hover:bg-[var(--color-magenta)] hover:text-white',
        ghost: 'text-[var(--color-chrome)] hover:bg-[rgba(0,255,255,0.1)] hover:text-[var(--color-cyan)] border-transparent'
    };

    const sizeClasses = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-2'
    };

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                (disabled || isLoading || isLocked) && 'opacity-50 cursor-not-allowed pointer-events-none',
                className
            )}
            disabled={disabled || isLoading || isLocked}
            {...props}
        >
            <span className="inline-flex items-center gap-2 transform skew-x-12">
                {isLocked && <Lock className="w-4 h-4" />}
                {isLoading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    children
                )}
            </span>
        </button>
    );
}
