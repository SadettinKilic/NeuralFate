import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface StoryParams {
    player1Name: string;
    player2Name: string;
    player1Avatar: string;
    player2Avatar: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface StoryResult {
    convergenceLocation: string;
    dilemmas: Array<{
        time: string;
        player: number;
        question: string;
        options: string[];
        locations: string[];
    }>;
    killerPlayer: number;
    finalExplanation: string;
}

export interface QuestionParams {
    player1Name: string;
    player2Name: string;
    player1Choices: Array<{ time: string; question: string; selected: string }>;
    player2Choices: Array<{ time: string; question: string; selected: string }>;
}

export interface QuestionResult {
    questions: Array<{
        question: string;
        targetPlayer: number;
        correctAnswer: string;
        options: string[];
        suspicionImpact: number;
        isCritical: boolean;
    }>;
}

/**
 * Generate a complete story scenario with dilemmas for both players
 */
export async function generateStory(params: StoryParams): Promise<StoryResult> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const difficultyConfig = {
        EASY: { dilemmaCount: 4, interval: '3-4 hours' },
        MEDIUM: { dilemmaCount: 6, interval: '2 hours' },
        HARD: { dilemmaCount: 8, interval: 'every hour' }
    };

    const config = difficultyConfig[params.difficulty];

    const prompt = `You are a psychological thriller writer.

TASK: Create a noir detective story for two players: "${params.player1Name}" and "${params.player2Name}" in TURKISH language.

RULES:
1. Both characters are strangers who don't know each other
2. Generate ${config.dilemmaCount} completely mundane dilemmas per player between 07:00-23:30
3. Dilemmas should be simple daily choices: "İşe git / Evde kal", "Metroya bin / Yürü", "Kahve dükkanı / Evde kahvaltı"
4. CRITICAL: Secretly make both players visit the SAME location at the SAME TIME without them knowing (Invisible Convergence)
5. Randomly select one player as the "Real Killer" (1 or 2)
6. Create a final explanation connecting the killer's mundane choices to the crime
7. ALL TEXT MUST BE IN TURKISH (TÜRKÇE)

CONVERGENCE LOCATIONS (choose one): Hastane, Merkez Parkı, Metro İstasyonu, AVM, Kütüphane

OUTPUT FORMAT (JSON):
{
  "convergenceLocation": "exact location name in Turkish",
  "convergenceTime": "HH:MM",
  "dilemmas": [
    {
      "time": "07:00",
      "player": 1,
      "question": "Uyandın ve...",
      "options": ["Seçenek A", "Seçenek B"],
      "locations": ["A seçilirse gidilecek yer", "B seçilirse gidilecek yer"]
    }
  ],
  "killerPlayer": 1 or 2,
  "finalExplanation": "Detailed explanation of how the killer's choices led to the murder in Turkish"
}

IMPORTANT:
- Dilemmas must alternate between players
- Ensure at least one choice per player leads to convergenceLocation at convergenceTime
- Keep language atmospheric and noir-style
- Return ONLY valid JSON, no markdown formatting`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean JSON response (remove markdown if present)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Invalid response from Gemini');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
        convergenceLocation: parsed.convergenceLocation,
        dilemmas: parsed.dilemmas,
        killerPlayer: parsed.killerPlayer,
        finalExplanation: parsed.finalExplanation
    };
}

/**
 * Generate interrogation questions based on player choices
 */
export async function generateQuestions(params: QuestionParams): Promise<QuestionResult> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a manipulative detective interrogating two suspects.

SUSPECTS:
- Player 1: ${params.player1Name}
- Player 2: ${params.player2Name}

PLAYER 1 CHOICES:
${params.player1Choices.map(c => `${c.time}: ${c.question} → ${c.selected}`).join('\n')}

PLAYER 2 CHOICES:
${params.player2Choices.map(c => `${c.time}: ${c.question} → ${c.selected}`).join('\n')}

TASK: Generate 10 interrogation questions that test memory recall in TURKISH (TÜRKÇE). This is a MEMORY TEST.

RULES:
1. Questions should ask about specific details from their day
2. Each question should have 3-4 plausible options (only one correct)
3. Mix easy and hard questions
4. Target both players (5 questions each)
5. Suspicion Impact: Correct = -10 to -20, Wrong = 0, Timeout (15s) = +10 to +20
6. Mark 2-3 questions as "critical" (wrong answer could end the game)
7. ALL TEXT MUST BE IN TURKISH

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "question": "Evden saat kaçta çıktın?",
      "targetPlayer": 1,
      "correctAnswer": "07:30",
      "options": ["07:00", "07:30", "08:00", "08:30"],
      "suspicionImpact": -15,
      "isCritical": false
    }
  ]
}

Return ONLY valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Invalid response from Gemini');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
        questions: parsed.questions
    };
}

/**
 * Generate CCTV image description for Nano Banana
 */
export function generateCCTVPrompt(
    player1Avatar: string,
    player2Avatar: string,
    location: string
): string {
    return `CCTV security camera footage from ${location}, grainy black and white, timestamp visible, showing ${player1Avatar} and ${player2Avatar} in the same frame, noir detective atmosphere, cinematic angle`;
}
