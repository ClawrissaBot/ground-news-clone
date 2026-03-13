import { getDb, type StoryWithArticles } from './db';
import { BIAS_ORDER } from './bias';

export function getStories(limit = 50, offset = 0, category?: string): StoryWithArticles[] {
  const db = getDb();

  let query = 'SELECT * FROM clusters WHERE article_count > 0';
  const params: any[] = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const clusters = db.prepare(query).all(...params) as any[];
  return clusters.map(c => enrichCluster(db, c));
}

export function getTrendingStories(period: 'day' | 'week' | 'month' = 'day', limit = 10, category?: string): StoryWithArticles[] {
  const db = getDb();
  const intervals: Record<string, string> = {
    day: '-1 day',
    week: '-7 days',
    month: '-30 days',
  };

  let query = `
    SELECT c.*, COUNT(DISTINCT a.source_id) as unique_sources
    FROM clusters c
    JOIN articles a ON a.cluster_id = c.id
    WHERE c.article_count > 1
      AND a.published_at >= datetime('now', ?)
  `;
  const params: any[] = [intervals[period]];

  if (category && category !== 'all') {
    query += ' AND c.category = ?';
    params.push(category);
  }

  query += ' GROUP BY c.id ORDER BY unique_sources DESC, c.article_count DESC LIMIT ?';
  params.push(limit);

  const clusters = db.prepare(query).all(...params) as any[];
  return clusters.map(c => enrichCluster(db, c));
}

export function getStoriesCount(category?: string): number {
  const db = getDb();
  if (category && category !== 'all') {
    const row = db.prepare('SELECT COUNT(*) as cnt FROM clusters WHERE article_count > 0 AND category = ?').get(category) as any;
    return row?.cnt || 0;
  }
  const row = db.prepare('SELECT COUNT(*) as cnt FROM clusters WHERE article_count > 0').get() as any;
  return row?.cnt || 0;
}

export function getCategoryCounts(): Record<string, number> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT category, COUNT(*) as cnt 
    FROM clusters 
    WHERE article_count > 0 
    GROUP BY category 
    ORDER BY cnt DESC
  `).all() as { category: string; cnt: number }[];
  
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.category] = r.cnt;
  return counts;
}

export function getStory(id: number): StoryWithArticles | null {
  const db = getDb();
  const cluster = db.prepare('SELECT * FROM clusters WHERE id = ?').get(id) as any;
  if (!cluster) return null;
  return enrichCluster(db, cluster);
}

function enrichCluster(db: any, cluster: any): StoryWithArticles {
  const articles = db.prepare(`
    SELECT a.*, a.category as article_category, a.tags,
           s.name as source_name, s.bias as source_bias, s.factual as source_factual
    FROM articles a
    JOIN sources s ON a.source_id = s.id
    WHERE a.cluster_id = ?
    ORDER BY a.published_at DESC
  `).all(cluster.id) as any[];

  const bias_breakdown: Record<string, number> = {};
  for (const a of articles) {
    bias_breakdown[a.source_bias] = (bias_breakdown[a.source_bias] || 0) + 1;
  }

  // Detect blindspot
  let blindspot: string | null = null;
  const leftSide = (bias_breakdown['LEFT'] || 0) + (bias_breakdown['LEFT-CENTER'] || 0);
  const rightSide = (bias_breakdown['RIGHT'] || 0) + (bias_breakdown['RIGHT-CENTER'] || 0);
  const center = bias_breakdown['CENTER'] || 0;

  if (articles.length >= 2) {
    if (leftSide > 0 && rightSide === 0 && center === 0) blindspot = 'RIGHT';
    else if (rightSide > 0 && leftSide === 0 && center === 0) blindspot = 'LEFT';
  }

  return {
    ...cluster,
    articles,
    bias_breakdown,
    blindspot,
  };
}

export function getSourceStats() {
  const db = getDb();
  return db.prepare(`
    SELECT s.*, COUNT(a.id) as article_count
    FROM sources s
    LEFT JOIN articles a ON a.source_id = s.id
    GROUP BY s.id
    ORDER BY s.bias, s.name
  `).all();
}
