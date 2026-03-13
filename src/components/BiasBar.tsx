'use client';

import { getBiasColor, getBiasLabel, BIAS_ORDER } from '@/lib/bias';

interface BiasBarProps {
  breakdown: Record<string, number>;
  showLabels?: boolean;
}

export function BiasBar({ breakdown, showLabels = false }: BiasBarProps) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-1">
      <div className="flex h-3 rounded-full overflow-hidden bg-zinc-800">
        {BIAS_ORDER.map(bias => {
          const count = breakdown[bias] || 0;
          if (count === 0) return null;
          const pct = (count / total) * 100;
          return (
            <div
              key={bias}
              className="h-full transition-all"
              style={{
                width: `${pct}%`,
                backgroundColor: getBiasColor(bias),
                minWidth: count > 0 ? '4px' : 0,
              }}
              title={`${getBiasLabel(bias)}: ${count} article${count > 1 ? 's' : ''}`}
            />
          );
        })}
      </div>
      {showLabels && (
        <div className="flex justify-between text-[10px] text-zinc-500">
          {BIAS_ORDER.map(b => (
            <span key={b} style={{ color: getBiasColor(b) }}>{getBiasLabel(b)}</span>
          ))}
        </div>
      )}
    </div>
  );
}
