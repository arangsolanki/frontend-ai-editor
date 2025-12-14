/**
 * Root Layout Component
 * 
 * Provides the HTML structure and global styles for the application.
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Writing Assistant | Chronicle Interview Task',
  description: 'An AI-assisted text editor built with ProseMirror, XState, and Next.js',
  keywords: ['AI', 'text editor', 'ProseMirror', 'XState', 'Next.js', 'TypeScript'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

