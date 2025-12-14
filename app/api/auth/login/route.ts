/**
 * API Route: /api/auth/login
 * 
 * Handles user authentication.
 * Validates credentials against environment variables.
 */

import { NextRequest, NextResponse } from 'next/server';

interface LoginRequest {
  username: string;
  password: string;
}

/**
 * POST /api/auth/login
 * 
 * Request body:
 * {
 *   username: string,
 *   password: string
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequest = await request.json();
    
    // Validate input
    if (!body.username || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get credentials from environment variables
    const validUsername = process.env.AUTH_USERNAME;
    const validPassword = process.env.AUTH_PASSWORD;

    // Check if credentials are configured
    if (!validUsername || !validPassword) {
      console.error('Authentication credentials not configured in environment variables');
      return NextResponse.json(
        { success: false, message: 'Authentication not configured' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (body.username === validUsername && body.password === validPassword) {
      return NextResponse.json({ success: true });
    }

    // Invalid credentials
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

