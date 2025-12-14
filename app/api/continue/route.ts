/**
 * API Route: /api/continue
 * 
 * Handles AI text continuation requests using OpenAI.
 * Accepts text input and returns AI-generated continuation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { continueWriting } from '@/lib/ai-service';
import { ContinueWritingRequest } from '@/lib/types';

/**
 * POST /api/continue
 * 
 * Request body:
 * {
 *   text: string,
 *   maxTokens?: number
 * }
 * 
 * Response:
 * {
 *   continuedText: string,
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ContinueWritingRequest = await request.json();
    
    // Validate input
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (body.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    // Call AI service (OpenAI)
    const result = await continueWriting(body);

    // Check if there was an error
    if (result.error) {
      return NextResponse.json(
        {
          continuedText: '',
          error: result.error,
        },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      continuedText: result.continuedText,
    });
  } catch (error) {
    console.error('Error in /api/continue:', error);
    
    return NextResponse.json(
      {
        continuedText: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/continue
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'AI continuation API is running',
    provider: 'openai',
  });
}
