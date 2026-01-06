/**
 * AI Opponent Logic for Solo Mode
 * Simulates an AI player with difficulty-based accuracy
 */

export interface AIResponse {
    answer: string;
    isCorrect: boolean;
    responseTime: number; // milliseconds
}

/**
 * Simulate AI opponent's response to an interrogation question
 * @param correctAnswer - The correct answer to the question
 * @param options - All available answer options
 * @param difficulty - Game difficulty level
 * @returns AI's chosen answer and whether it's correct
 */
export function simulateAIResponse(
    correctAnswer: string,
    options: string[],
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
): AIResponse {
    const errorRates = {
        EASY: 0.35,    // 35% chance of error
        MEDIUM: 0.18,  // 18% chance of error
        HARD: 0.05     // 5% chance of error
    };

    const errorRate = errorRates[difficulty];
    const willMakeError = Math.random() < errorRate;

    let answer: string;
    let isCorrect: boolean;

    if (willMakeError) {
        // Pick a wrong answer
        const wrongOptions = options.filter(opt => opt !== correctAnswer);
        answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        isCorrect = false;
    } else {
        // Pick correct answer
        answer = correctAnswer;
        isCorrect = true;
    }

    // Simulate thinking time (AI is faster on HARD difficulty)
    const baseTime = {
        EASY: 3000,   // 3 seconds (slower, more "human-like")
        MEDIUM: 2000, // 2 seconds
        HARD: 1200    // 1.2 seconds (very fast)
    };

    const responseTime = baseTime[difficulty] + Math.random() * 1000;

    return {
        answer,
        isCorrect,
        responseTime
    };
}

/**
 * Generate AI opponent's name based on mode
 */
export function getAIOpponentName(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): string {
    const names = {
        EASY: 'Neural Shadow (Trainee)',
        MEDIUM: 'Neural Shadow (Agent)',
        HARD: 'Neural Shadow (Elite)'
    };

    return names[difficulty];
}

/**
 * Get AI avatar visual prompt for image generation
 */
export function getAIAvatarPrompt(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): string {
    const prompts = {
        EASY: 'Young AI agent with minimal cybernetic enhancements, uncertain expression',
        MEDIUM: 'Professional AI agent with moderate cybernetics, confident stance',
        HARD: 'Elite AI operative with advanced neural implants, cold calculating gaze'
    };

    return prompts[difficulty];
}

/**
 * Calculate AI's final suspicion level based on performance
 * Used to determine winner in Solo mode
 */
export function calculateAISuspicion(
    correctAnswers: number,
    totalQuestions: number,
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
): number {
    const accuracyRate = correctAnswers / totalQuestions;

    // Base suspicion starts at 100
    let suspicion = 100;

    // Reduce suspicion based on correct answers
    suspicion -= accuracyRate * 80; // Up to -80 for perfect score

    // Add slight randomness based on difficulty
    const randomFactor = {
        EASY: Math.random() * 20,    // +0 to +20
        MEDIUM: Math.random() * 10,  // +0 to +10
        HARD: Math.random() * 5      // +0 to +5
    };

    suspicion += randomFactor[difficulty];

    // Ensure suspicion stays within bounds
    return Math.max(0, Math.min(100, Math.round(suspicion)));
}
