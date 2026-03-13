import { getDb } from '../src/lib/db';
import { SOURCES } from '../src/lib/bias';

const db = getDb();

const insert = db.prepare(`
  INSERT OR REPLACE INTO sources (name, domain, bias, factual, country, rss_url)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertAll = db.transaction(() => {
  for (const s of SOURCES) {
    insert.run(s.name, s.domain, s.bias, s.factual, s.country, s.rss_url);
    console.log(`  ✓ ${s.name} (${s.bias})`);
  }
});

console.log(`Seeding ${SOURCES.length} sources...`);
insertAll();
console.log('Done!');
