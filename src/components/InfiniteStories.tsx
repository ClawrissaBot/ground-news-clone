'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { StoryCard } from './StoryCard';
import { Loader2 } from 'lucide-react';
import type { StoryWithArticles } from '@/lib/db';

const PAGE_SIZE = 20;

export function InfiniteStories({ initial }: { initial: StoryWithArticles[] }) {
  const [stories, setStories] = useState<StoryWithArticles[]>(initial);
  const [offset, setOffset] = useState(initial.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stories?limit=${PAGE_SIZE}&offset=${offset}`);
      const data = await res.json();
      if (data.stories && data.stories.length > 0) {
        setStories(prev => {
          const existingIds = new Set(prev.map(s => s.id));
          const newStories = data.stories.filter((s: StoryWithArticles) => !existingIds.has(s.id));
          return [...prev, ...newStories];
        });
        setOffset(prev => prev + data.stories.length);
        setHasMore(data.hasMore ?? data.stories.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, offset]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stories.map(s => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>

      <div ref={sentinelRef} className="py-8 flex justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading more stories...
          </div>
        )}
        {!hasMore && stories.length > 0 && (
          <p className="text-zinc-600 text-sm">You've reached the end · {stories.length} stories loaded</p>
        )}
      </div>
    </div>
  );
}
