import { getStories } from '@/lib/stories';
import { StoryCard } from '@/components/StoryCard';
import { TrendingStories } from '@/components/TrendingStories';
import { InfiniteStories } from '@/components/InfiniteStories';
import { BIAS_ORDER, getBiasColor, getBiasLabel } from '@/lib/bias';
import type { StoryWithArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function Home() {
  let stories: StoryWithArticles[] = [];
  try {
    stories = getStories(20);
  } catch {
    stories = [];
  }

  const blindspotStories = stories.filter(s => s.blindspot);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">NewsLens</h1>
        <p className="text-zinc-400">See how news is covered across the political spectrum</p>
        <div className="flex gap-4 text-xs mt-2">
          {BIAS_ORDER.map(b => (
            <span key={b} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getBiasColor(b) }} />
              {getBiasLabel(b)}
            </span>
          ))}
        </div>
      </div>

      {/* Top Coverage — day/week/month */}
      <TrendingStories />

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
        {stories.length > 0 ? (
          <InfiniteStories initial={stories} />
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
