import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addEmail, getAllEmails, getEmailCount, checkRateLimit } from '@/lib/db';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(255),
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const ipAddress = getClientIP(request);

    if (!checkRateLimit(ipAddress)) {
      return NextResponse.json(
        { success: false, message: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const dbResult = addEmail(email, ipAddress);

    if (dbResult.success) {
      return NextResponse.json({ success: true, message: dbResult.message });
    } else {
      return NextResponse.json(
        { success: false, message: dbResult.message },
        { status: 409 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const sessionId = request.cookies.get('admin_session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { validateSession } = await import('@/lib/auth');
    const isValid = validateSession(sessionId);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    const emails = getAllEmails();
    const count = getEmailCount();

    return NextResponse.json({
      success: true,
      data: {
        emails,
        count,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
