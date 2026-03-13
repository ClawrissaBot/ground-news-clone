import { NextRequest, NextResponse } from 'next/server';
import { getStories, getTrendingStories, getStoriesCount, getCategoryCounts } from '@/lib/stories';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const trending = searchParams.get('trending');
    const period = (searchParams.get('period') || 'day') as 'day' | 'week' | 'month';
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (searchParams.get('counts') === 'true') {
      return NextResponse.json({ counts: getCategoryCounts() });
    }

    if (trending === 'true') {
      const stories = getTrendingStories(period, limit, category);
      return NextResponse.json({ stories, total: stories.length });
    }

    const stories = getStories(limit, offset, category);
    const total = getStoriesCount(category);
    return NextResponse.json({ stories, total, offset, limit, hasMore: offset + limit < total });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}
