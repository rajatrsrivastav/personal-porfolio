import { NextResponse } from 'next/server';
import { isPublic, normalize, readPosts, sortPosts, verifySession, writePosts, validatePost, storageErrorResponse } from '../../../lib/posts.js';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
async function isAdmin() { return verifySession((await cookies()).get('admin_session')?.value); }
async function readBody(request) {
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 200_000) return { error: json({ error: 'Post too large.' }, 413) };
  try { return { body: JSON.parse(raw) }; } catch { return { error: json({ error: 'Invalid JSON.' }, 400) }; }
}
function validOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || new URL(request.url).protocol.slice(0, -1);
  return origin === process.env.SITE_URL || origin === `${protocol}://${host}`;
}

export async function GET(request) {
  const url = new URL(request.url);
  const admin = await isAdmin();
  if (url.searchParams.get('all') === 'true' && !admin) return json({ error: 'Authentication required.' }, 401);
  try { return json(sortPosts((await readPosts()).filter(post => url.searchParams.get('all') === 'true' && admin || isPublic(post)))); }
  catch (error) { return storageErrorResponse(error); }
}

export async function POST(request) {
  if (!validOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  if (!await isAdmin()) return json({ error: 'Authentication required.' }, 401);
  const parsed = await readBody(request);
  if (parsed.error) return parsed.error;
  const payload = parsed.body;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json({ error: 'Invalid post fields.' }, 400);
  let previous;
  try { previous = await readPosts(); } catch (error) { return storageErrorResponse(error); }
  const record = normalize({
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: payload.status === 'published' ? payload.publishedAt || new Date().toISOString() : payload.publishedAt || null,
  });
  const error = validatePost(record);
  if (error) return json({ error }, 400);
  if (previous.some(post => post.slug === record.slug)) return json({ error: 'Slug already exists.' }, 409);
  previous.unshift(record);
  try { await writePosts(previous); } catch (error) { return storageErrorResponse(error); }
  return json(record, 201);
}
