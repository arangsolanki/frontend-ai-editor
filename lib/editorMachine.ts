/**
 * XState State Machine for AI Editor
 * 
 * Manages the state transitions for the AI-assisted text editor.
 * States: idle -> loading -> (success | error) -> idle
 */

import { setup, assign } from 'xstate';
import type { EditorContext, EditorEvent } from './types';

/**
 * Initial context for the editor state machine
 */
const initialContext: EditorContext = {
  currentText: '',
  generatedText: null,
  error: null,
  lastRequestTime: null,
};

/**
 * Editor State Machine
 * 
 * This machine manages the lifecycle of AI text generation:
 * - idle: Editor is ready, user can type and request AI continuation
 * - loading: AI request is in progress
 * - success: AI successfully generated text
 * - error: AI request failed
 * 
 * The machine automatically transitions back to idle after success/error
 * to allow for subsequent requests.
 */
export const editorMachine = setup({
  types: {
    context: {} as EditorContext,
    events: {} as EditorEvent,
  },
  actions: {
    /**
     * Store the current text and timestamp when starting AI generation
     */
    setCurrentText: assign({
      currentText: ({ event }) => {
        if (event.type === 'CONTINUE_WRITING') {
          return event.text;
        }
        return '';
      },
      lastRequestTime: () => Date.now(),
      error: () => null,
      generatedText: () => null,
    }),
    
    /**
     * Store the AI-generated text on success
     */
    setGeneratedText: assign({
      generatedText: ({ event }) => {
        if (event.type === 'SUCCESS') {
          return event.generatedText;
        }
        return null;
      },
      error: () => null,
    }),
    
    /**
     * Store the error message on failure
     */
    setError: assign({
      error: ({ event }) => {
        if (event.type === 'ERROR') {
          return event.error;
        }
        return null;
      },
      generatedText: () => null,
    }),
    
    /**
     * Reset the machine to initial state
     */
    reset: assign(() => initialContext),
  },
  guards: {
    /**
     * Check if enough time has passed since last request (rate limiting)
     */
    canMakeRequest: ({ context }) => {
      if (!context.lastRequestTime) return true;
      const timeSinceLastRequest = Date.now() - context.lastRequestTime;
      const minTimeBetweenRequests = 1000; // 1 second
      return timeSinceLastRequest >= minTimeBetweenRequests;
    },
    
    /**
     * Validate that text is not empty
     */
    hasText: ({ event }) => {
      if (event.type === 'CONTINUE_WRITING') {
        return event.text.trim().length > 0;
      }
      return false;
    },
  },
}).createMachine({
  id: 'editor',
  initial: 'idle',
  context: initialContext,
  states: {
    /**
     * Idle state - Ready for user interaction
     * Can transition to loading when CONTINUE_WRITING event is received
     */
    idle: {
      on: {
        CONTINUE_WRITING: {
          target: 'loading',
          guard: { type: 'hasText' },
          actions: ['setCurrentText'],
        },
        RESET: {
          actions: ['reset'],
        },
      },
    },
    
    /**
     * Loading state - AI request in progress
     * Shows loading indicator to user
     */
    loading: {
      on: {
        SUCCESS: {
          target: 'success',
          actions: ['setGeneratedText'],
        },
        ERROR: {
          target: 'error',
          actions: ['setError'],
        },
      },
    },
    
    /**
     * Success state - AI text generated successfully
     * Automatically transitions back to idle after a brief delay
     */
    success: {
      after: {
        100: 'idle', // Quick transition to allow for smooth UX
      },
    },
    
    /**
     * Error state - AI request failed
     * Shows error message to user
     * Automatically transitions back to idle after delay
     */
    error: {
      after: {
        3000: 'idle', // Give user time to read error message
      },
      on: {
        RESET: {
          target: 'idle',
          actions: ['reset'],
        },
      },
    },
  },
});

/**
 * Type helpers for the state machine
 */
export type EditorMachine = typeof editorMachine;
export type EditorActor = ReturnType<EditorMachine['provide']>;

