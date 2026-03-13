import { getStory } from '@/lib/stories';
import { BiasBar } from '@/components/BiasBar';
import { getBiasColor, getBiasLabel, BIAS_ORDER } from '@/lib/bias';
import { timeAgo } from '@/lib/utils';
import { AlertTriangle, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = getStory(parseInt(params.id));
  if (!story) notFound();

  // Group articles by bias
  const articlesByBias: Record<string, typeof story.articles> = {};
  for (const bias of BIAS_ORDER) {
    const arts = story.articles.filter(a => a.source_bias === bias);
    if (arts.length > 0) articlesByBias[bias] = arts;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to stories
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{story.title}</h1>

        {story.blindspot && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            This story has a <strong>{getBiasLabel(story.blindspot)} blindspot</strong> — 
            it&apos;s only being covered by {story.blindspot === 'RIGHT' ? 'left-leaning' : 'right-leaning'} sources
          </div>
        )}

        <div className="space-y-2">
          <BiasBar breakdown={story.bias_breakdown} showLabels />
          <p className="text-sm text-zinc-500">
            {story.article_count} article{story.article_count > 1 ? 's' : ''} from{' '}
            {new Set(story.articles.map(a => a.source_name)).size} sources
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {BIAS_ORDER.map(bias => {
          const arts = articlesByBias[bias];
          if (!arts) return null;
          return (
            <section key={bias}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getBiasColor(bias) }} />
                <h2 className="text-lg font-semibold" style={{ color: getBiasColor(bias) }}>
                  {getBiasLabel(bias)}
                </h2>
                <span className="text-xs text-zinc-500">({arts.length})</span>
              </div>
              <div className="space-y-3">
                {arts.map(article => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-600 transition group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-zinc-400">{article.source_name}</span>
                          <span className="text-xs text-zinc-600">·</span>
                          <span className="text-xs text-zinc-600">{timeAgo(article.published_at)}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                            {article.source_factual}
                          </span>
                        </div>
                        <h3 className="font-medium text-zinc-200 group-hover:text-white line-clamp-2">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{article.description}</p>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-1" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
