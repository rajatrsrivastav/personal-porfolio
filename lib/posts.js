import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const SESSION_SECONDS = 7 * 24 * 60 * 60;
const file = resolve(process.env.POSTS_FILE || 'data/posts.json');
const redisKey = process.env.POSTS_REDIS_KEY || 'portfolio:posts';
let writeQueue = Promise.resolve();
const sha = value => createHash('sha256').update(value).digest();
const secret = () => process.env.ADMIN_PASSKEY || '';

export function normalize(post) {
  const category = post.category ?? post.topic ?? '';
  const excerpt = post.excerpt ?? post.description ?? '';
  return {
    ...post,
    id: post.id || post.slug,
    category,
    excerpt,
    topic: category,
    description: excerpt,
    tags: Array.isArray(post.tags) ? post.tags : category.split(',').map(tag => tag.trim()).filter(Boolean),
    updatedAt: post.updatedAt || post.createdAt || null,
    publishedAt: post.publishedAt || (post.status === 'published' ? post.createdAt || null : null),
  };
}

export function isPublic(post) {
  return post.status === 'published' && (!post.publishedAt || Date.parse(post.publishedAt) <= Date.now());
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL
    || process.env.KV_REST_API_URL
    || process.env.STORAGE_REST_API_URL
    || process.env.STORAGE_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
    || process.env.KV_REST_API_TOKEN
    || process.env.STORAGE_REST_API_TOKEN
    || process.env.STORAGE_TOKEN;
  return url && token ? { url, token } : null;
}

export async function readPosts() {
  const redis = getRedisConfig();
  if (redis) {
    const response = await fetch(redis.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${redis.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['GET', redisKey]),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('The post database is unavailable.');
    const result = await response.json();
    if (result.error) throw new Error('The post database is unavailable.');
    if (result.result == null) return [];
    const value = JSON.parse(result.result);
    if (!Array.isArray(value)) throw new Error('Post database returned invalid data.');
    return value.map(normalize);
  }
  if (process.env.VERCEL) return [];
  try {
    const value = JSON.parse(await readFile(file, 'utf8'));
    if (!Array.isArray(value)) throw new Error('Post store must contain an array');
    return value.map(normalize);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export async function writePosts(posts) {
  const redis = getRedisConfig();
  if (redis) {
    const response = await fetch(redis.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${redis.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['SET', redisKey, JSON.stringify(posts)]),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('The post database is unavailable.');
    const result = await response.json();
    if (result.error) throw new Error('The post database is unavailable.');
    return;
  }
  if (process.env.VERCEL) {
    const error = new Error('Configure Upstash Redis for durable CMS storage on Vercel.');
    error.code = 'STORE_NOT_CONFIGURED';
    throw error;
  }
  const operation = writeQueue.then(async () => {
    await mkdir(dirname(file), { recursive: true });
    const temp = `${file}.${process.pid}.tmp`;
    await writeFile(temp, JSON.stringify(posts, null, 2));
    await rename(temp, file);
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

export function storageErrorResponse(error) {
  const status = error?.code === 'STORE_NOT_CONFIGURED' ? 503 : 500;
  return Response.json({ error: status === 503 ? error.message : 'Post storage is temporarily unavailable.' }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function signSession(value) {
  return createHmac('sha256', secret()).update(value).digest('hex');
}

export function verifySession(token) {
  if (!secret() || typeof token !== 'string') return false;
  const [expires, nonce, signature] = token.split('.');
  if (!expires || !nonce || !signature || Number(expires) <= Date.now()) return false;
  return timingSafeEqual(sha(signature), sha(signSession(`${expires}.${nonce}`)));
}

export function issueSession() {
  const value = `${Date.now() + SESSION_SECONDS * 1000}.${randomUUID()}`;
  return { token: `${value}.${signSession(value)}`, maxAge: SESSION_SECONDS };
}

export function validPasskey(value) {
  return Boolean(secret() && typeof value === 'string' && timingSafeEqual(sha(value), sha(secret())));
}

export function validatePost(post) {
  const required = ['title', 'slug', 'category', 'readTime', 'excerpt', 'content'];
  if (!required.every(key => typeof post[key] === 'string' && post[key].trim())) return 'Complete all required post fields.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) return 'Use a lowercase URL slug with hyphens only.';
  if (!['draft', 'published'].includes(post.status)) return 'Status must be draft or published.';
  if (post.title.length > 200 || post.excerpt.length > 1000 || ['slug', 'category', 'readTime'].some(key => post[key].length > 200)) return 'One or more post fields are too long.';
  if (post.publishedAt != null && (typeof post.publishedAt !== 'string' || !Number.isFinite(Date.parse(post.publishedAt)))) return 'Publication date must be a valid date.';
  return null;
}

export function sortPosts(posts) {
  return posts.sort((a, b) => Date.parse(b.publishedAt || b.updatedAt || b.createdAt || 0) - Date.parse(a.publishedAt || a.updatedAt || a.createdAt || 0));
}
