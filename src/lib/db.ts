import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'news.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      domain TEXT UNIQUE NOT NULL,
      bias TEXT NOT NULL DEFAULT 'CENTER',
      factual TEXT NOT NULL DEFAULT 'HIGH',
      country TEXT DEFAULT 'US',
      rss_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id INTEGER NOT NULL REFERENCES sources(id),
      title TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      description TEXT,
      content TEXT,
      author TEXT,
      image_url TEXT,
      published_at DATETIME,
      fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      cluster_id INTEGER,
      category TEXT DEFAULT 'general',
      tags TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS clusters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      category TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      article_count INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_clusters_category ON clusters(category);

    CREATE INDEX IF NOT EXISTS idx_articles_cluster ON articles(cluster_id);
    CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source_id);
    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sources_domain ON sources(domain);
  `);
}

export type Source = {
  id: number;
  name: string;
  domain: string;
  bias: string;
  factual: string;
  country: string;
  rss_url: string | null;
};

export type Article = {
  id: number;
  source_id: number;
  title: string;
  url: string;
  description: string | null;
  content: string | null;
  author: string | null;
  image_url: string | null;
  published_at: string | null;
  fetched_at: string;
  cluster_id: number | null;
};

export type Cluster = {
  id: number;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  article_count: number;
};

export type StoryWithArticles = Cluster & {
  articles: (Article & { source_name: string; source_bias: string; source_factual: string })[];
  bias_breakdown: Record<string, number>;
  blindspot: string | null;
};
