'use client';

import Link from 'next/link';
import { BiasBar } from './BiasBar';
import { timeAgo } from '@/lib/utils';
import type { StoryWithArticles } from '@/lib/db';
import { AlertTriangle } from 'lucide-react';
import { getBiasLabel } from '@/lib/bias';

export function StoryCard({ story }: { story: StoryWithArticles }) {
  const latestArticle = story.articles[0];
  const sourceCount = new Set(story.articles.map(a => a.source_name)).size;

  return (
    <Link href={`/story/${story.id}`}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-white leading-tight line-clamp-2">
            {story.title}
          </h2>
          {story.blindspot && (
            <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              {getBiasLabel(story.blindspot)} blindspot
            </div>
          )}
        </div>

        {latestArticle?.description && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
            {latestArticle.description}
          </p>
        )}

        <BiasBar breakdown={story.bias_breakdown} />

        <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
          <span>{story.article_count} article{story.article_count > 1 ? 's' : ''} · {sourceCount} source{sourceCount > 1 ? 's' : ''}</span>
          {latestArticle?.published_at && (
            <span>{timeAgo(latestArticle.published_at)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
