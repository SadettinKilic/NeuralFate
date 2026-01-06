'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Room, Player, Choice } from '@/lib/utils/supabase';

export type GameMode = 'local' | 'online' | 'solo';
export type GamePhase = 'setup' | 'character' | 'lobby' | 'day' | 'interrogation' | 'results';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface PlayerData {
    id?: string;
    name: string;
    avatar: string;
    choices: Choice[];
    suspicionLevel: number;
    isKiller: boolean;
}

export interface GameContextType {
    // Mode & Phase
    gameMode: GameMode | null;
    setGameMode: (mode: GameMode | null) => void;
    gamePhase: GamePhase;
    setGamePhase: (phase: GamePhase) => void;

    // Room & Multiplayer
    room: Room | null;
    setRoom: (room: Room | null) => void;
    roomCode: string | null;
    setRoomCode: (code: string | null) => void;

    // Player Data
    currentPlayer: number; // 1 or 2 (which player is currently active)
    setCurrentPlayer: (player: number) => void;
    player1: PlayerData;
    setPlayer1: (data: PlayerData) => void;
    player2: PlayerData;
    setPlayer2: (data: PlayerData) => void;

    // Game Settings
    difficulty: Difficulty;
    setDifficulty: (diff: Difficulty) => void;

    // Game State
    currentTime: string; // HH:MM format (07:00 - 23:30)
    setCurrentTime: (time: string) => void;
    convergenceLocation: string | null;
    setConvergenceLocation: (location: string | null) => void;

    // Solo Mode
    isVsAI: boolean;
    setIsVsAI: (vs: boolean) => void;

    // User ID (for multiplayer)
    userId: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameMode, setGameMode] = useState<GameMode | null>(null);
    const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
    const [room, setRoom] = useState<Room | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<number>(1);
    const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
    const [currentTime, setCurrentTime] = useState<string>('07:00');
    const [convergenceLocation, setConvergenceLocation] = useState<string | null>(null);
    const [isVsAI, setIsVsAI] = useState<boolean>(false);
    const [userId] = useState<string>(() => crypto.randomUUID());

    const [player1, setPlayer1] = useState<PlayerData>({
        name: '',
        avatar: '',
        choices: [],
        suspicionLevel: 100,
        isKiller: false
    });

    const [player2, setPlayer2] = useState<PlayerData>({
        name: '',
        avatar: '',
        choices: [],
        suspicionLevel: 100,
        isKiller: false
    });

    // Save to localStorage in local mode
    useEffect(() => {
        if (gameMode === 'local') {
            localStorage.setItem('neural-fate-p1', JSON.stringify(player1));
            localStorage.setItem('neural-fate-p2', JSON.stringify(player2));
            localStorage.setItem('neural-fate-current', currentPlayer.toString());
            localStorage.setItem('neural-fate-time', currentTime);
        }
    }, [gameMode, player1, player2, currentPlayer, currentTime]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedP1 = localStorage.getItem('neural-fate-p1');
        const savedP2 = localStorage.getItem('neural-fate-p2');
        const savedCurrent = localStorage.getItem('neural-fate-current');
        const savedTime = localStorage.getItem('neural-fate-time');

        if (savedP1) setPlayer1(JSON.parse(savedP1));
        if (savedP2) setPlayer2(JSON.parse(savedP2));
        if (savedCurrent) setCurrentPlayer(parseInt(savedCurrent));
        if (savedTime) setCurrentTime(savedTime);
    }, []);

    const value: GameContextType = {
        gameMode,
        setGameMode,
        gamePhase,
        setGamePhase,
        room,
        setRoom,
        roomCode,
        setRoomCode,
        currentPlayer,
        setCurrentPlayer,
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        difficulty,
        setDifficulty,
        currentTime,
        setCurrentTime,
        convergenceLocation,
        setConvergenceLocation,
        isVsAI,
        setIsVsAI,
        userId
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
