'use client';

import { useState, useEffect } from 'react';
import { StoryCard } from './StoryCard';
import { TrendingUp, Flame } from 'lucide-react';
import type { StoryWithArticles } from '@/lib/db';

const PERIODS = [
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
] as const;

export function TrendingStories() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [stories, setStories] = useState<StoryWithArticles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stories?trending=true&period=${period}&limit=6`)
      .then(r => r.json())
      .then(data => {
        setStories(data.stories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-semibold">Top Coverage</h2>
          <span className="text-xs text-zinc-500 ml-1">by source count</span>
        </div>
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                period === p.key
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
              <div className="h-3 bg-zinc-800 rounded w-2/3 mb-4" />
              <div className="h-2 bg-zinc-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : stories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <div key={s.id} className="relative">
              {i < 3 && (
                <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {i + 1}
                </div>
              )}
              <StoryCard story={s} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 text-sm py-8 text-center">No trending stories for this period</p>
      )}
    </section>
  );
}
