'use client';

import { useState, useEffect } from 'react';
import { StoryCard } from '@/components/StoryCard';
import { TrendingStories } from '@/components/TrendingStories';
import { InfiniteStories } from '@/components/InfiniteStories';
import { CategoryNav } from '@/components/CategoryNav';
import { BIAS_ORDER, getBiasColor, getBiasLabel } from '@/lib/bias';
import type { StoryWithArticles } from '@/lib/db';

export default function Home() {
  const [category, setCategory] = useState('all');
  const [stories, setStories] = useState<StoryWithArticles[]>([]);
  const [blindspotStories, setBlindspotStories] = useState<StoryWithArticles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '20', offset: '0' });
    if (category !== 'all') params.set('category', category);
    
    fetch(`/api/stories?${params}`)
      .then(r => r.json())
      .then(data => {
        const all = data.stories || [];
        setStories(all);
        setBlindspotStories(all.filter((s: StoryWithArticles) => s.blindspot));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">NewsLens</h1>
        <p className="text-zinc-400 text-sm">See how news is covered across the political spectrum</p>
        <div className="flex gap-4 text-xs">
          {BIAS_ORDER.map(b => (
            <span key={b} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getBiasColor(b) }} />
              {getBiasLabel(b)}
            </span>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNav selected={category} onChange={setCategory} />

      {/* Top Coverage — day/week/month */}
      <TrendingStories category={category} />

      {/* Blindspot Stories */}
      {blindspotStories.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-amber-400 mb-4">🔍 Blindspot Stories</h2>
          <p className="text-xs text-zinc-500 mb-3">Stories only covered by one side of the spectrum</p>
          <div className="grid gap-4 md:grid-cols-2">
            {blindspotStories.slice(0, 4).map(s => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      )}

      {/* All Stories — infinite scroll */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📰 All Stories</h2>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-2/3 mb-4" />
                <div className="h-2 bg-zinc-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : stories.length > 0 ? (
          <InfiniteStories key={category} initial={stories} category={category} />
        ) : (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-xl mb-2">No stories yet</p>
            <p>Run <code className="bg-zinc-800 px-2 py-1 rounded">npm run fetch-articles</code> to fetch news</p>
          </div>
        )}
      </section>
    </div>
  );
}
