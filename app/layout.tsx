/**
 * Root Layout Component
 * 
 * Provides the HTML structure, global styles, and authentication context.
 */

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'AI Writing Assistant',
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

