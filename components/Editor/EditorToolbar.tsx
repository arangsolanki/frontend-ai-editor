/**
 * Editor Toolbar Component
 * 
 * Provides UI controls for the editor, including the "Continue Writing" button.
 */

'use client';

import React from 'react';

interface EditorToolbarProps {
  onContinueWriting: () => void;
  onReset: () => void;
  isLoading: boolean;
  disabled: boolean;
}

/**
 * Toolbar component with editor controls
 */
export default function EditorToolbar({
  onContinueWriting,
  onReset,
  isLoading,
  disabled,
}: EditorToolbarProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        {/* AI Icon */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            AI Writing Assistant
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Type your text and let AI continue
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={isLoading}
          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear editor"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        {/* Continue Writing Button */}
        <button
          onClick={onContinueWriting}
          disabled={disabled}
          className={`
            px-6 py-2 text-sm font-semibold text-white rounded-lg
            transition-all duration-200 flex items-center gap-2
            ${
              disabled
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span>Continue Writing</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

