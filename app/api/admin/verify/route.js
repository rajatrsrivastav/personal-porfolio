import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '../../../../lib/posts.js';
export const runtime = 'nodejs';
export async function GET() {
  const token = (await cookies()).get('admin_session')?.value;
  if (verifySession(token)) return NextResponse.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } });
  const response = NextResponse.json({ error: 'Session expired. Please sign in.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set('admin_session', '', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
  return response;
}
