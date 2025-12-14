/**
 * ProseMirror Editor Component
 * 
 * React wrapper for ProseMirror editor with AI continuation capabilities.
 * Integrates with XState machine for state management.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorView } from 'prosemirror-view';
import { useMachine } from '@xstate/react';
import { editorMachine } from '@/lib/editorMachine';
import { 
  createEditorState, 
  createEditorView, 
  insertTextWithTypingEffect,
  getTextContent 
} from '@/lib/prosemirrorSetup';
import { ContinueWritingResponse } from '@/lib/types';
import EditorToolbar from './EditorToolbar';

/**
 * Main Editor Component
 */
export default function Editor() {
  // XState machine for managing editor state
  const [state, send] = useMachine(editorMachine);
  
  // Refs for ProseMirror
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  
  // Local state for editor content
  const [editorContent, setEditorContent] = useState('');
  
  // Track if typing animation is in progress
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Initialize ProseMirror editor on mount
   */
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    // Callback when editor content changes
    const handleUpdate = (text: string) => {
      setEditorContent(text);
    };

    // Create editor state and view
    const state = createEditorState('', handleUpdate);
    const view = createEditorView({
      state,
      mount: editorRef.current,
      onUpdate: handleUpdate,
    });

    viewRef.current = view;

    // Cleanup on unmount
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  /**
   * Handle "Continue Writing" button click
   * Sends event to XState machine and makes API call
   */
  const handleContinueWriting = async () => {
    if (!viewRef.current) return;
    
    const currentText = getTextContent(viewRef.current);
    
    if (!currentText.trim()) {
      alert('Please write something first!');
      return;
    }

    // Send event to state machine
    send({ type: 'CONTINUE_WRITING', text: currentText });

    try {
      // Call the API to get AI continuation
      const response = await fetch('/api/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentText,
          maxTokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data: ContinueWritingResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Start typing animation
      setIsTyping(true);
      
      // Insert AI-generated text with typing effect
      await insertTextWithTypingEffect(viewRef.current, data.continuedText, 30);
      
      // End typing animation
      setIsTyping(false);

      // Send success event to state machine
      send({ type: 'SUCCESS', generatedText: data.continuedText });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setIsTyping(false); // Reset typing state on error
      send({ type: 'ERROR', error: errorMessage });
    }
  };

  /**
   * Handle reset button click
   */
  const handleReset = () => {
    if (!viewRef.current) return;
    
    // Clear the editor content
    const { state } = viewRef.current;
    const tr = state.tr.delete(0, state.doc.content.size);
    viewRef.current.dispatch(tr);
    
    // Reset the state machine
    send({ type: 'RESET' });
  };

  // Get current machine state
  const isLoading = state.matches('loading');
  const isError = state.matches('error');
  const errorMessage = state.context.error;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Editor Toolbar */}
      <EditorToolbar
        onContinueWriting={handleContinueWriting}
        onReset={handleReset}
        isLoading={isLoading || isTyping}
        disabled={!editorContent.trim() || isLoading || isTyping}
      />

      {/* Error Message */}
      {isError && errorMessage && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className="relative">
        <div
          ref={editorRef}
          className="border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20"
        />
        
        {/* Loading Overlay */}
        {isLoading && !isTyping && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI is thinking...
              </p>
            </div>
          </div>
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm font-medium">AI is typing...</span>
          </div>
        )}
      </div>

      {/* Character Count */}
      <div className="mt-2 text-right text-sm text-gray-500 dark:text-gray-400">
        {editorContent.length} characters
      </div>

      {/* State Indicator (for debugging/demo) */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Editor State:</span>
          <span className={`font-mono font-semibold ${
            isLoading ? 'text-blue-600 dark:text-blue-400' :
            isError ? 'text-red-600 dark:text-red-400' :
            'text-green-600 dark:text-green-400'
          }`}>
            {state.value.toString()}
          </span>
        </div>
      </div>
    </div>
  );
}

