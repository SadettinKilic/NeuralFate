import { NextRequest, NextResponse } from 'next/server';
import { generateStory } from '@/lib/utils/gemini';
import { getCachedScenario } from '@/lib/utils/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { player1Name, player2Name, player1Avatar, player2Avatar, difficulty } = body;

        if (!player1Name || !player2Name || !difficulty) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Try to get cached scenario first
        const { scenario } = await getCachedScenario(difficulty);

        if (scenario) {
            console.log('Using cached scenario:', scenario.id);
            return NextResponse.json({
                convergenceLocation: scenario.convergence_location,
                dilemmas: scenario.dilemmas,
                killerPlayer: Math.random() < 0.5 ? 1 : 2, // Randomize killer for reused scenarios
                finalExplanation: 'Story from our database of successful scenarios',
                cached: true
            });
        }

        // Generate new story with Gemini
        console.log('Generating new story with Gemini...');
        const story = await generateStory({
            player1Name,
            player2Name,
            player1Avatar,
            player2Avatar,
            difficulty: difficulty as 'EASY' | 'MEDIUM' | 'HARD'
        });

        return NextResponse.json({
            ...story,
            cached: false
        });
    } catch (error: any) {
        console.error('Error generating story:', error);
        return NextResponse.json(
            { error: 'Failed to generate story', details: error.message },
            { status: 500 }
        );
    }
}
