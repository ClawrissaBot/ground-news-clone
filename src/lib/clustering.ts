import { getDb, type Article } from './db';

// Simple TF-IDF + cosine similarity clustering

const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','it','as','was','are','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'can','this','that','these','those','he','she','they','we','you','i','me',
  'him','her','us','them','my','your','his','its','our','their','what','which',
  'who','whom','when','where','why','how','all','each','every','both','few',
  'more','most','other','some','such','no','not','only','same','so','than',
  'too','very','just','about','up','out','if','then','new','also','said',
  'says','s','t','re','ve','ll','d','m','don','didn','doesn','won','isn',
  'aren','wasn','weren','hasn','haven','hadn','wouldn','couldn','shouldn',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  // Normalize
  const max = Math.max(...tf.values(), 1);
  for (const [k, v] of tf) tf.set(k, v / max);
  return tf;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, magA = 0, magB = 0;
  for (const [k, v] of a) {
    magA += v * v;
    const bv = b.get(k);
    if (bv) dot += v * bv;
  }
  for (const [, v] of b) magB += v * v;
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

const SIMILARITY_THRESHOLD = 0.25;

export function clusterArticles(): number {
  const db = getDb();

  // Get unclustered articles from last 3 days
  const articles = db.prepare(`
    SELECT id, title, description FROM articles
    WHERE cluster_id IS NULL
    AND published_at > datetime('now', '-3 days')
    ORDER BY published_at DESC
  `).all() as Pick<Article, 'id' | 'title' | 'description'>[];

  if (articles.length === 0) return 0;

  // Build TF vectors
  const vectors = articles.map(a => {
    const text = `${a.title} ${a.title} ${a.description || ''}`; // Title weighted 2x
    return { id: a.id, title: a.title, tf: termFrequency(tokenize(text)) };
  });

  // Also get existing clusters (recent) to potentially merge into
  const existingClusters = db.prepare(`
    SELECT c.id, c.title, GROUP_CONCAT(a.title, ' | ') as titles
    FROM clusters c
    JOIN articles a ON a.cluster_id = c.id
    WHERE c.updated_at > datetime('now', '-3 days')
    GROUP BY c.id
  `).all() as { id: number; title: string; titles: string }[];

  const clusterVectors = existingClusters.map(c => ({
    clusterId: c.id,
    tf: termFrequency(tokenize(`${c.title} ${c.titles}`)),
  }));

  const updateArticleCluster = db.prepare('UPDATE articles SET cluster_id = ? WHERE id = ?');
  const createCluster = db.prepare('INSERT INTO clusters (title) VALUES (?)');
  const updateClusterCount = db.prepare(`
    UPDATE clusters SET
      article_count = (SELECT COUNT(*) FROM articles WHERE cluster_id = clusters.id),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  let clustered = 0;

  const doCluster = db.transaction(() => {
    for (const vec of vectors) {
      let bestMatch: { clusterId: number; score: number } | null = null;

      // Check against existing clusters
      for (const cv of clusterVectors) {
        const score = cosineSimilarity(vec.tf, cv.tf);
        if (score > SIMILARITY_THRESHOLD && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { clusterId: cv.clusterId, score };
        }
      }

      if (bestMatch) {
        updateArticleCluster.run(bestMatch.clusterId, vec.id);
        updateClusterCount.run(bestMatch.clusterId);
      } else {
        // Check against other unclustered articles in this batch
        let foundPeer = false;
        for (const other of vectors) {
          if (other.id === vec.id) continue;
          const score = cosineSimilarity(vec.tf, other.tf);
          if (score > SIMILARITY_THRESHOLD) {
            // Create new cluster
            const result = createCluster.run(vec.title);
            const clusterId = result.lastInsertRowid as number;
            updateArticleCluster.run(clusterId, vec.id);
            updateClusterCount.run(clusterId);
            clusterVectors.push({ clusterId, tf: vec.tf });
            foundPeer = true;
            break;
          }
        }

        if (!foundPeer) {
          // Singleton cluster
          const result = createCluster.run(vec.title);
          const clusterId = result.lastInsertRowid as number;
          updateArticleCluster.run(clusterId, vec.id);
          updateClusterCount.run(clusterId);
          clusterVectors.push({ clusterId, tf: vec.tf });
        }
      }
      clustered++;
    }
  });

  doCluster();
  return clustered;
}
