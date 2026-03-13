import Parser from 'rss-parser';
import { getDb, type Source } from './db';
import { categorizeArticle } from './categorizer';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'GroundNewsClone/1.0 (RSS Reader)',
  },
});

export async function fetchFeedForSource(source: Source): Promise<number> {
  if (!source.rss_url) return 0;
  const db = getDb();

  try {
    const feed = await parser.parseURL(source.rss_url);
    const insert = db.prepare(`
      INSERT OR IGNORE INTO articles (source_id, title, url, description, author, image_url, published_at, category, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    const insertMany = db.transaction((items: typeof feed.items) => {
      for (const item of items) {
        if (!item.title || !item.link) continue;
        const desc = (item.contentSnippet || item.content || '').slice(0, 1000);
        const imageUrl = item.enclosure?.url || extractImageFromContent(item.content || '') || null;
        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : null;

        const { category, tags } = categorizeArticle(item.title, desc, item.link);

        const result = insert.run(
          source.id,
          item.title.trim(),
          item.link.trim(),
          desc,
          item.creator || item.author || null,
          imageUrl,
          pubDate,
          category,
          tags.join(',')
        );
        if (result.changes > 0) count++;
      }
    });

    insertMany(feed.items || []);
    return count;
  } catch (err) {
    console.error(`Failed to fetch RSS for ${source.name}: ${(err as Error).message}`);
    return 0;
  }
}

function extractImageFromContent(content: string): string | null {
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

export async function fetchAllFeeds(): Promise<{ total: number; errors: number }> {
  const db = getDb();
  const sources = db.prepare('SELECT * FROM sources WHERE rss_url IS NOT NULL').all() as Source[];

  let total = 0;
  let errors = 0;

  // Fetch in batches of 5 to avoid overwhelming
  for (let i = 0; i < sources.length; i += 5) {
    const batch = sources.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map(s => fetchFeedForSource(s))
    );
    for (const r of results) {
      if (r.status === 'fulfilled') {
        total += r.value;
      } else {
        errors++;
      }
    }
  }

  return { total, errors };
}
