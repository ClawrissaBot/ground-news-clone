import { NextRequest, NextResponse } from 'next/server';
import { getStories, getTrendingStories, getStoriesCount } from '@/lib/stories';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const trending = searchParams.get('trending');
    const period = (searchParams.get('period') || 'day') as 'day' | 'week' | 'month';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (trending === 'true') {
      const stories = getTrendingStories(period, limit);
      return NextResponse.json({ stories, total: stories.length });
    }

    const stories = getStories(limit, offset);
    const total = getStoriesCount();
    return NextResponse.json({ stories, total, offset, limit, hasMore: offset + limit < total });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}
