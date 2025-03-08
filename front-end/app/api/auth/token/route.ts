import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This endpoint will be called by the extension to get the token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vscodeAuthToken');
      if (token) {
        localStorage.removeItem('vscodeAuthToken'); // Clear the token after retrieving it
        return NextResponse.json({ token });
      }
    }
    return NextResponse.json({ error: 'No token found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 