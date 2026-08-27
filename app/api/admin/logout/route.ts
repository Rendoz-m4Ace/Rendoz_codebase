import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin_session')?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.delete('admin_session');

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
