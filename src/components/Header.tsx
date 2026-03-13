'use client';

import Link from 'next/link';
import { Newspaper, Library } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-zinc-200">
          <Newspaper className="w-6 h-6 text-purple-400" />
          NewsLens
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
            Stories
          </Link>
          <Link href="/sources" className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-1">
            <Library className="w-4 h-4" />
            Sources
          </Link>
        </nav>
      </div>
    </header>
  );
}
