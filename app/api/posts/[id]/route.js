import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isPublic, normalize, readPosts, validatePost, verifySession, writePosts, storageErrorResponse } from '../../../../lib/posts.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
async function authorized() { return verifySession((await cookies()).get('admin_session')?.value); }
async function allowedOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || new URL(request.url).protocol.slice(0, -1);
  return origin === process.env.SITE_URL || origin === `${protocol}://${host}`;
}
export async function GET(request, { params }) {
  const { id } = await params;
  const url = new URL(request.url);
  const admin = await authorized();
  if (url.searchParams.get('all') === 'true' && !admin) return json({ error: 'Authentication required.' }, 401);
  try {
    const post = (await readPosts()).map(normalize).find(item => (item.id === id || item.slug === id) && (admin && url.searchParams.get('all') === 'true' || isPublic(item)));
    return post ? json(post) : json({ error: 'Post not found.' }, 404);
  } catch (error) { return storageErrorResponse(error); }
}
export async function PATCH(request, context) { return update(request, context); }
export async function PUT(request, context) { return update(request, context); }
async function update(request, { params }) {
  if (!await allowedOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  if (!await authorized()) return json({ error: 'Authentication required.' }, 401);
  const { id } = await params;
  let payload;
  try { const raw = await request.text(); if (Buffer.byteLength(raw) > 200_000) return json({ error: 'Post too large.' }, 413); payload = JSON.parse(raw); }
  catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json({ error: 'Invalid post fields.' }, 400);
  let posts;
  try { posts = await readPosts(); } catch (error) { return storageErrorResponse(error); }
  const index = posts.findIndex(post => post.id === id || post.slug === id);
  if (index < 0) return json({ error: 'Post not found.' }, 404);
  const previous = posts[index];
  const changed = { ...previous };
  for (const key of ['title', 'slug', 'category', 'readTime', 'excerpt', 'content', 'status', 'publishedAt']) if (Object.hasOwn(payload, key)) changed[key] = payload[key];
  if (Object.hasOwn(payload, 'topic') && !Object.hasOwn(payload, 'category')) changed.category = payload.topic;
  if (Object.hasOwn(payload, 'description') && !Object.hasOwn(payload, 'excerpt')) changed.excerpt = payload.description;
  changed.updatedAt = new Date().toISOString();
  if (changed.status === 'published' && !changed.publishedAt) changed.publishedAt = new Date().toISOString();
  const record = normalize(changed);
  const error = validatePost(record);
  if (error) return json({ error }, 400);
  if (posts.some((post, position) => position !== index && post.slug === record.slug)) return json({ error: 'Slug already exists.' }, 409);
  posts[index] = record;
  try { await writePosts(posts); } catch (error) { return storageErrorResponse(error); }
  return json(record);
}
export async function DELETE(request, { params }) {
  if (!await allowedOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  if (!await authorized()) return json({ error: 'Authentication required.' }, 401);
  const { id } = await params;
  let posts;
  try { posts = await readPosts(); } catch (error) { return storageErrorResponse(error); }
  const index = posts.findIndex(post => post.id === id || post.slug === id);
  if (index < 0) return json({ error: 'Post not found.' }, 404);
  posts.splice(index, 1);
  try { await writePosts(posts); } catch (error) { return storageErrorResponse(error); }
  return json({ deleted: true });
}
