/**
 * AI Service Module
 * 
 * Provides integration with OpenAI for text continuation functionality.
 */

import { ContinueWritingRequest, ContinueWritingResponse } from './types';

/**
 * OpenAI API integration for text continuation
 * Uses GPT-3.5-turbo model for high-quality text generation
 */
async function continueWithOpenAI(text: string, apiKey: string, maxTokens: number = 150): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant. Continue the user\'s text naturally and coherently. Do not repeat what they wrote, just continue from where they left off.',
        },
        {
          role: 'user',
          content: `Continue writing this text naturally:\n\n${text}`,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API request failed');
  }

  const data = await response.json();
  const continuedText = data.choices[0]?.message?.content?.trim() || '';
  
  return continuedText;
}

/**
 * Main function to continue writing using OpenAI
 * 
 * @param request - The continuation request with text and options
 * @returns Promise with the continued text and metadata
 */
export async function continueWriting(
  request: ContinueWritingRequest
): Promise<ContinueWritingResponse> {
  try {
    const { text, maxTokens = 150 } = request;

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Please provide some text to continue from');
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file');
    }

    // Call OpenAI API
    const continuedText = await continueWithOpenAI(text, apiKey, maxTokens);

    return {
      continuedText,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      continuedText: '',
      error: errorMessage,
    };
  }
}

/**
 * Check if OpenAI service is configured and ready
 */
export function isAIConfigured(): { configured: boolean; message: string } {
  const hasKey = !!process.env.OPENAI_API_KEY;
  
  return {
    configured: hasKey,
    message: hasKey ? 'OpenAI configured' : 'OpenAI API key not found',
  };
}
