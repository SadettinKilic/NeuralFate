import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/utils/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { player1Name, player2Name, player1Choices, player2Choices } = body;

        if (!player1Name || !player2Name || !player1Choices || !player2Choices) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        console.log('Generating interrogation questions...');
        const result = await generateQuestions({
            player1Name,
            player2Name,
            player1Choices,
            player2Choices
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error generating questions:', error);
        return NextResponse.json(
            { error: 'Failed to generate questions', details: error.message },
            { status: 500 }
        );
    }
}
