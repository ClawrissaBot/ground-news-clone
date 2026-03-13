import { NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/rss';
import { clusterArticles } from '@/lib/clustering';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const { total, errors } = await fetchAllFeeds();
    const clustered = clusterArticles();
    return NextResponse.json({ fetched: total, errors, clustered });
  } catch (e) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
