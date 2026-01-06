'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { X, Minus, Square } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Window Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className={cn(
                            "relative w-full max-w-2xl bg-black border-2 border-[var(--color-cyan)] shadow-[0_0_40px_rgba(0,255,255,0.3)] z-10",
                            className
                        )}
                    >
                        {/* Retro Window Title Bar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-[rgba(0,255,255,0.1)] border-b border-[var(--color-cyan)]">
                            <h2 className="font-heading text-[var(--color-cyan)] uppercase tracking-wider text-sm md:text-base">
                                {title || 'SYSTEM_MESSAGE'}
                            </h2>

                            {/* Window Controls */}
                            <div className="flex items-center gap-4">
                                <Minus className="w-4 h-4 text-[var(--color-magenta)] opacity-50 cursor-not-allowed" />
                                <Square className="w-3 h-3 text-[var(--color-magenta)] opacity-50 cursor-not-allowed" />
                                <button
                                    onClick={onClose}
                                    className="text-[var(--color-magenta)] hover:text-white transition-colors hover:scale-110 transform"
                                >
                                    <X className="w-5 h-5 bg-[var(--color-magenta)] text-black p-0.5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="font-mono text-[var(--color-chrome)]">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
