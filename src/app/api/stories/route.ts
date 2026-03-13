import { NextResponse } from 'next/server';
import { getStories } from '@/lib/stories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stories = getStories(50);
    return NextResponse.json(stories);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}
