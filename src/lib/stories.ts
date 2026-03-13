import { getDb, type StoryWithArticles } from './db';
import { BIAS_ORDER } from './bias';

export function getStories(limit = 50, offset = 0): StoryWithArticles[] {
  const db = getDb();

  const clusters = db.prepare(`
    SELECT * FROM clusters
    WHERE article_count > 0
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as any[];

  return clusters.map(c => enrichCluster(db, c));
}

export function getStory(id: number): StoryWithArticles | null {
  const db = getDb();
  const cluster = db.prepare('SELECT * FROM clusters WHERE id = ?').get(id) as any;
  if (!cluster) return null;
  return enrichCluster(db, cluster);
}

function enrichCluster(db: any, cluster: any): StoryWithArticles {
  const articles = db.prepare(`
    SELECT a.*, s.name as source_name, s.bias as source_bias, s.factual as source_factual
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
