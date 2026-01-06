'use client';

import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'strong' | 'border';
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
    const variantClasses = {
        default: 'glass shadow-deep',
        strong: 'glass-strong shadow-deep',
        border: 'glass neon-border shadow-deep'
    };

    return (
        <div
            className={cn(
                'p-6',
                variantClasses[variant],
                animate && 'float-animation hover:scale-105 transition-transform duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
