import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Room {
    id: string;
    room_code: string;
    host_id: string | null;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    status: 'waiting' | 'playing' | 'finished';
    created_at: string;
    started_at: string | null;
    current_phase: 'setup' | 'day' | 'interrogation' | 'results';
}

export interface Player {
    id: string;
    room_id: string;
    player_number: number;
    name: string;
    avatar: string;
    choices: Choice[];
    suspicion_level: number;
    is_killer: boolean;
    created_at: string;
}

export interface Choice {
    time: string;
    question: string;
    selected: string;
    location?: string;
}

export interface Scenario {
    id: string;
    difficulty: string;
    convergence_location: string;
    dilemmas: Dilemma[];
    questions: Question[];
    rating: number;
    play_count: number;
    created_at: string;
}

export interface Dilemma {
    time: string;
    question: string;
    options: string[];
    locations: string[];
}

export interface Question {
    question: string;
    target_player: number;
    correct_answer: string;
    options: string[];
    suspicion_impact: number;
    is_critical: boolean;
}

export interface GameState {
    id: string;
    room_id: string;
    current_time: string;
    phase: string;
    data: any;
    updated_at: string;
}

// Helper: Generate 4-digit room code
export function generateRoomCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Helper: Create a new room
export async function createRoom(
    hostId: string,
    difficulty: Room['difficulty']
): Promise<{ room: Room | null; error: any }> {
    const roomCode = generateRoomCode();

    const { data, error } = await supabase
        .from('rooms')
        .insert({
            room_code: roomCode,
            host_id: hostId,
            difficulty,
            status: 'waiting',
            current_phase: 'setup'
        })
        .select()
        .single();

    return { room: data, error };
}

// Helper: Join existing room
export async function joinRoom(roomCode: string): Promise<{ room: Room | null; error: any }> {
    const { data, error } = await supabase
        .from('rooms')
        .select()
        .eq('room_code', roomCode)
        .eq('status', 'waiting')
        .single();

    return { room: data, error };
}

// Helper: Add player to room
export async function addPlayer(
    roomId: string,
    playerNumber: number,
    name: string,
    avatar: string
): Promise<{ player: Player | null; error: any }> {
    const { data, error } = await supabase
        .from('players')
        .insert({
            room_id: roomId,
            player_number: playerNumber,
            name,
            avatar,
            choices: [],
            suspicion_level: 100,
            is_killer: false
        })
        .select()
        .single();

    return { player: data, error };
}

// Helper: Update player choices
export async function updatePlayerChoices(
    playerId: string,
    choices: Choice[]
): Promise<{ error: any }> {
    const { error } = await supabase
        .from('players')
        .update({ choices })
        .eq('id', playerId);

    return { error };
}

// Helper: Update suspicion level
export async function updateSuspicionLevel(
    playerId: string,
    suspicionLevel: number
): Promise<{ error: any }> {
    const { error } = await supabase
        .from('players')
        .update({ suspicion_level: suspicionLevel })
        .eq('id', playerId);

    return { error };
}

// Helper: Get cached scenario
export async function getCachedScenario(
    difficulty: string
): Promise<{ scenario: Scenario | null; error: any }> {
    const { data: scenarios, error } = await supabase
        .from('scenarios')
        .select()
        .eq('difficulty', difficulty)
        .gte('rating', 3)
        .order('play_count', { ascending: true })
        .limit(10);

    if (error || !scenarios || scenarios.length < 10) {
        return { scenario: null, error };
    }

    // 40% chance to reuse
    if (Math.random() < 0.4) {
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        // Increment play count
        await supabase
            .from('scenarios')
            .update({ play_count: randomScenario.play_count + 1 })
            .eq('id', randomScenario.id);

        return { scenario: randomScenario, error: null };
    }

    return { scenario: null, error: null };
}

// Helper: Save scenario after rating
export async function saveScenario(
    difficulty: string,
    convergenceLocation: string,
    dilemmas: Dilemma[],
    questions: Question[],
    rating: number
): Promise<{ error: any }> {
    if (rating < 3) {
        return { error: null }; // Don't save low-rated scenarios
    }

    const { error } = await supabase
        .from('scenarios')
        .insert({
            difficulty,
            convergence_location: convergenceLocation,
            dilemmas,
            questions,
            rating,
            play_count: 1
        });

    return { error };
}
