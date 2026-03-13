'use client';

import Link from 'next/link';
import { BiasBar } from './BiasBar';
import { timeAgo } from '@/lib/utils';
import type { StoryWithArticles } from '@/lib/db';
import { AlertTriangle } from 'lucide-react';
import { getBiasLabel } from '@/lib/bias';
import { getCategoryInfo } from '@/lib/categorizer';

export function StoryCard({ story }: { story: StoryWithArticles }) {
  const latestArticle = story.articles[0];
  const sourceCount = new Set(story.articles.map(a => a.source_name)).size;
  const cat = getCategoryInfo((story as any).category || 'general');

  return (
    <Link href={`/story/${story.id}`}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all cursor-pointer group">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: cat.color + '20', color: cat.color }}
          >
            {cat.emoji} {cat.label}
          </span>
          {latestArticle?.published_at && (
            <span className="text-[10px] text-zinc-600">{timeAgo(latestArticle.published_at)}</span>
          )}
        </div>
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

        {/* Tags from articles */}
        {(() => {
          const allTags = new Set<string>();
          story.articles.forEach(a => {
            ((a as any).tags || '').split(',').filter(Boolean).forEach((t: string) => allTags.add(t));
          });
          const tags = [...allTags].slice(0, 4);
          if (tags.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                  #{t}
                </span>
              ))}
            </div>
          );
        })()}

        <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
          <span>{story.article_count} article{story.article_count > 1 ? 's' : ''} · {sourceCount} source{sourceCount > 1 ? 's' : ''}</span>
        </div>
      </div>
    </Link>
  );
}
