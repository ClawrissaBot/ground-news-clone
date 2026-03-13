import { getStories } from '@/lib/stories';
import { StoryCard } from '@/components/StoryCard';
import { BiasBar } from '@/components/BiasBar';
import { BIAS_ORDER, getBiasColor, getBiasLabel } from '@/lib/bias';
import type { StoryWithArticles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function Home() {
  let stories: StoryWithArticles[] = [];
  try {
    stories = getStories(50);
  } catch {
    stories = [];
  }

  const multiSourceStories = stories.filter(s => s.article_count > 1);
  const singleSourceStories = stories.filter(s => s.article_count === 1);
  const blindspotStories = stories.filter(s => s.blindspot);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Today&apos;s Stories</h1>
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

      {blindspotStories.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-amber-400 mb-4">🔍 Blindspot Stories</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {blindspotStories.slice(0, 4).map(s => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      )}

      {multiSourceStories.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">📰 Multi-Source Coverage</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {multiSourceStories.slice(0, 20).map(s => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Latest Stories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(multiSourceStories.length > 0 ? singleSourceStories : stories).slice(0, 30).map(s => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      </section>

      {stories.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-xl mb-2">No stories yet</p>
          <p>Run <code className="bg-zinc-800 px-2 py-1 rounded">npm run fetch-articles</code> to fetch news</p>
        </div>
      )}
    </div>
  );
}
