import { NextResponse } from 'next/server';
import { getLinkMetadata } from '../../../lib/link-metadata.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const metadata = await getLinkMetadata(new URL(request.url).searchParams.get('url'));
  return NextResponse.json({ metadata }, {
    headers: { 'Cache-Control': metadata ? 'public, max-age=300' : 'public, max-age=60' },
  });
}
