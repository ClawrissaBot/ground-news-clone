import { getSourceStats } from '@/lib/stories';
import { getBiasColor, getBiasLabel } from '@/lib/bias';

export const dynamic = 'force-dynamic';

export default function SourcesPage() {
  let sources: any[];
  try {
    sources = getSourceStats() as any[];
  } catch {
    sources = [];
  }

  const factualColors: Record<string, string> = {
    'VERY HIGH': 'text-emerald-400',
    'HIGH': 'text-green-400',
    'MOSTLY FACTUAL': 'text-yellow-400',
    'MIXED': 'text-orange-400',
    'LOW': 'text-red-400',
    'VERY LOW': 'text-red-500',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Source Directory</h1>
        <p className="text-zinc-400 mt-1">{sources.length} tracked news sources with bias and factual ratings</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((s: any) => (
          <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-zinc-100">{s.name}</h3>
                <p className="text-xs text-zinc-500">{s.domain}</p>
              </div>
              <span className="text-xs text-zinc-500">{s.country}</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: getBiasColor(s.bias) + '20',
                  color: getBiasColor(s.bias),
                }}
              >
                {getBiasLabel(s.bias)}
              </span>
              <span className={`text-xs ${factualColors[s.factual] || 'text-zinc-400'}`}>
                {s.factual}
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-2">{s.article_count} articles</p>
          </div>
        ))}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p>No sources yet. Run <code className="bg-zinc-800 px-2 py-1 rounded">npm run setup</code></p>
        </div>
      )}
    </div>
  );
}
