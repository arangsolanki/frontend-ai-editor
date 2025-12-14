/**
 * Type definitions for the AI Editor application
 */

/**
 * AI Service Provider types
 */
export type AIProvider = 'openai' | 'huggingface';

/**
 * Request to continue writing text
 */
export interface ContinueWritingRequest {
  text: string;
  maxTokens?: number;
}

/**
 * Response from AI service
 */
export interface ContinueWritingResponse {
  continuedText: string;
  provider: AIProvider;
  error?: string;
}

/**
 * Editor state types for XState machine
 */
export type EditorState = 
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

/**
 * Context for the editor state machine
 */
export interface EditorContext {
  currentText: string;
  generatedText: string | null;
  error: string | null;
  lastRequestTime: number | null;
}

/**
 * Events that can be sent to the editor state machine
 */
export type EditorEvent =
  | { type: 'CONTINUE_WRITING'; text: string }
  | { type: 'SUCCESS'; generatedText: string }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

/**
 * Configuration for AI services
 */
export interface AIConfig {
  provider: AIProvider;
  openaiApiKey?: string;
  huggingfaceApiKey?: string;
  huggingfaceModel?: string;
  maxTokens?: number;
  temperature?: number;
}

