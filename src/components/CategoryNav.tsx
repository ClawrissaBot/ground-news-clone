'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES, type CategoryId } from '@/lib/categorizer';

interface Props {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryNav({ selected, onChange }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/stories?counts=true')
      .then(r => r.json())
      .then(data => setCounts(data.counts || {}))
      .catch(() => {});
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1">
        <button
          onClick={() => onChange('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selected === 'all'
              ? 'bg-white text-black'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
          }`}
        >
          📰 All
          {total > 0 && <span className="text-[10px] opacity-60">{total}</span>}
        </button>
        {CATEGORIES.filter(c => c.id !== 'general').map(cat => {
          const count = counts[cat.id] || 0;
          if (count === 0 && selected !== cat.id) return null;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selected === cat.id
                  ? 'text-white border border-current'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
              }`}
              style={selected === cat.id ? { backgroundColor: cat.color + '20', borderColor: cat.color, color: cat.color } : {}}
            >
              {cat.emoji} {cat.label}
              {count > 0 && <span className="text-[10px] opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
