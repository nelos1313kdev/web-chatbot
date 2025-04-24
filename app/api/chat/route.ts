import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';
import { TextProcessor } from '@/lib/textProcessor';
import type { User } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has credits or active subscription
    if (user.credits <= 0 && user.subscription?.status !== 'active') {
      return NextResponse.json(
        { error: 'No credits remaining. Please subscribe to continue.' },
        { status: 403 }
      );
    }

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant. Your responses should be natural and human-like.
          Occasionally include minor grammatical variations and natural language patterns that make the text feel more authentic.
          Avoid perfect grammar and structure all the time.`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    let response = completion.choices[0].message.content || '';

    // Process the text to make it more undetectable
    response = await TextProcessor.processText(response);

    // Calculate detectability score
    const detectability = calculateDetectability(response);

    // Save the prompt and response
    await prisma.prompt.create({
      data: {
        content: message,
        response: response,
        userId: user.id,
        detectability,
      },
    });

    // Decrement credits if not subscribed
    if (user.subscription?.status !== 'active') {
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      });
    }

    return NextResponse.json({
      response,
      detectability,
      remainingCredits: user.subscription?.status === 'active' ? 'unlimited' : user.credits - 1,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateDetectability(text: string | null): number {
  if (!text) return 1;

  // This is a simplified version. In a real implementation, you would use
  // more sophisticated algorithms to analyze the text's characteristics
  const factors = [
    // Check for perfect grammar (lower score is better)
    hasPerfectGrammar(text) ? 0.8 : 0.2,
    // Check for natural language patterns
    hasNaturalPatterns(text) ? 0.1 : 0.7,
    // Check for variation in sentence structure
    hasVariedStructure(text) ? 0.2 : 0.6,
  ];

  return factors.reduce((a, b) => a + b) / factors.length;
}

function hasPerfectGrammar(text: string): boolean {
  // Implement grammar checking logic
  return false;
}

function hasNaturalPatterns(text: string): boolean {
  // Implement natural language pattern detection
  return true;
}

function hasVariedStructure(text: string): boolean {
  // Implement sentence structure variation analysis
  return true;
} 