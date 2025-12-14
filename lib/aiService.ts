/**
 * AI Service Module
 * 
 * Provides integration with AI providers (OpenAI and Hugging Face)
 * for text continuation functionality.
 */

import { AIProvider, ContinueWritingRequest, ContinueWritingResponse } from './types';

/**
 * OpenAI API integration for text continuation
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
 * Hugging Face Inference API integration for text continuation
 * Updated to use the Inference API with better error handling
 * Note: Uses Serverless Inference API - first request may be slow (cold start)
 */
async function continueWithHuggingFace(
  text: string,
  apiKey: string,
  model: string = 'mistralai/Mistral-7B-Instruct-v0.2',
  maxTokens: number = 150
): Promise<string> {
  // Format prompt for instruction-following models
  const prompt = `<s>[INST] Continue writing this text naturally and coherently. Only provide the continuation, do not repeat the original text.\n\nText: ${text}\n\nContinuation: [/INST]`;
  
  // Use the NEW Router API endpoint (api-inference.huggingface.co is deprecated)
  const apiUrl = `https://router.huggingface.co/models/${model}`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.7,
        return_full_text: false,
        do_sample: true,
        top_p: 0.95,
      },
      options: {
        wait_for_model: true, // Wait for model to load if it's sleeping
      },
    }),
  });

  // Handle non-OK responses
  if (!response.ok) {
    let errorMessage = `Hugging Face API request failed (${response.status})`;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        
        // Provide helpful hints for common errors
        if (errorMessage.includes('not found') || response.status === 404) {
          errorMessage = `Model '${model}' not found. Try using 'google/flan-t5-base' or 'gpt2' instead.`;
        } else if (errorMessage.includes('loading')) {
          errorMessage = 'Model is loading (cold start). Please wait 10-20 seconds and try again.';
        } else if (errorMessage.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        }
      } else {
        const textError = await response.text();
        if (textError.includes('Not Found')) {
          errorMessage = `Model '${model}' not found or not accessible. Try 'google/flan-t5-base' or check your HF token permissions.`;
        }
      }
    } catch (e) {
      // If we can't parse the error, use the default message
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Handle different response formats from Hugging Face
  let continuedText = '';
  
  if (Array.isArray(data) && data.length > 0) {
    // Standard array response format
    continuedText = data[0].generated_text?.trim() || '';
  } else if (typeof data === 'object' && data.generated_text) {
    // Direct object response format
    continuedText = data.generated_text.trim();
  } else if (typeof data === 'string') {
    // Some models return a string directly
    continuedText = data.trim();
  }
  
  // Clean up the response (remove instruction tags if present)
  continuedText = continuedText
    .replace(/\[\/INST\]/g, '')
    .replace(/<\/s>/g, '')
    .replace(/^\s*Continuation:\s*/i, '')
    .trim();

  if (!continuedText) {
    throw new Error('Hugging Face returned empty response. The model may not support text generation.');
  }

  return continuedText;
}

/**
 * Main function to continue writing using configured AI provider
 * 
 * @param request - The continuation request with text and options
 * @param provider - The AI provider to use ('openai' or 'huggingface')
 * @returns Promise with the continued text and metadata
 */
export async function continueWriting(
  request: ContinueWritingRequest,
  provider: AIProvider = 'openai'
): Promise<ContinueWritingResponse> {
  try {
    const { text, maxTokens = 150 } = request;

    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Please provide some text to continue from');
    }

    let continuedText = '';

    // Use appropriate AI provider
    if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      continuedText = await continueWithOpenAI(text, apiKey, maxTokens);
    } else if (provider === 'huggingface') {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      const model = process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';
      if (!apiKey) {
        throw new Error('Hugging Face API key not configured');
      }
      continuedText = await continueWithHuggingFace(text, apiKey, model, maxTokens);
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    return {
      continuedText,
      provider,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      continuedText: '',
      provider,
      error: errorMessage,
    };
  }
}

/**
 * Check if AI service is configured and ready
 */
export function isAIConfigured(): { configured: boolean; provider: AIProvider | null; message: string } {
  const provider = (process.env.AI_PROVIDER as AIProvider) || 'openai';
  
  if (provider === 'openai') {
    const hasKey = !!process.env.OPENAI_API_KEY;
    return {
      configured: hasKey,
      provider: hasKey ? 'openai' : null,
      message: hasKey ? 'OpenAI configured' : 'OpenAI API key not found',
    };
  } else if (provider === 'huggingface') {
    const hasKey = !!process.env.HUGGINGFACE_API_KEY;
    return {
      configured: hasKey,
      provider: hasKey ? 'huggingface' : null,
      message: hasKey ? 'Hugging Face configured' : 'Hugging Face API key not found',
    };
  }
  
  return {
    configured: false,
    provider: null,
    message: 'No AI provider configured',
  };
}

