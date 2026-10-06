import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function POST() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set('admin_session', '', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
  return response;
}
