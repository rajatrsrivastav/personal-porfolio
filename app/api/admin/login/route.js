import { NextResponse } from 'next/server';
import { issueSession, validPasskey } from '../../../../lib/posts.js';

export const runtime = 'nodejs';
const attempts = new Map();
export async function POST(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || new URL(request.url).protocol.slice(0, -1);
  if (origin && origin !== process.env.SITE_URL && origin !== `${protocol}://${host}`) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  if (!process.env.ADMIN_PASSKEY) return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 });
  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const attempt = attempts.get(address) || { count: 0, until: Date.now() + 60_000 };
  if (Date.now() > attempt.until) { attempt.count = 0; attempt.until = Date.now() + 60_000; }
  if (attempt.count >= 10) return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });
  let payload;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  if (!validPasskey(payload?.passkey)) { attempt.count++; attempts.set(address, attempt); return NextResponse.json({ error: 'Invalid passkey.' }, { status: 401 }); }
  attempts.delete(address);
  const session = issueSession();
  const response = NextResponse.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set('admin_session', session.token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: session.maxAge });
  return response;
}
