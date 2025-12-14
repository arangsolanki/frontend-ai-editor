/**
 * Type definitions for the AI Editor application
 */

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
