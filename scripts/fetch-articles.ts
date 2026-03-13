import { fetchAllFeeds } from '../src/lib/rss';
import { clusterArticles } from '../src/lib/clustering';

async function main() {
  console.log('Fetching articles from RSS feeds...');
  const { total, errors } = await fetchAllFeeds();
  console.log(`Fetched ${total} new articles (${errors} feed errors)`);

  console.log('Clustering articles...');
  const clustered = clusterArticles();
  console.log(`Clustered ${clustered} articles`);

  console.log('Done!');
}

main().catch(console.error);
