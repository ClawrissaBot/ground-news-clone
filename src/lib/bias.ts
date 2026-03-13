// Hardcoded MBFC-sourced bias data for 40+ major news sources
export type BiasRating = 'LEFT' | 'LEFT-CENTER' | 'CENTER' | 'RIGHT-CENTER' | 'RIGHT' | 'FAKE NEWS' | 'SATIRE' | 'PRO-SCIENCE' | 'CONSPIRACY';
export type FactualRating = 'VERY HIGH' | 'HIGH' | 'MOSTLY FACTUAL' | 'MIXED' | 'LOW' | 'VERY LOW';

export interface SourceData {
  name: string;
  domain: string;
  bias: BiasRating;
  factual: FactualRating;
  country: string;
  rss_url: string;
}

export const SOURCES: SourceData[] = [
  // LEFT
  { name: 'The Guardian', domain: 'theguardian.com', bias: 'LEFT', factual: 'HIGH', country: 'UK', rss_url: 'https://www.theguardian.com/world/rss' },
  { name: 'HuffPost', domain: 'huffpost.com', bias: 'LEFT', factual: 'HIGH', country: 'US', rss_url: 'https://chaski.huffpost.com/us/auto/vertical/us-news' },
  { name: 'The Intercept', domain: 'theintercept.com', bias: 'LEFT', factual: 'HIGH', country: 'US', rss_url: 'https://theintercept.com/feed/?rss' },
  { name: 'Mother Jones', domain: 'motherjones.com', bias: 'LEFT', factual: 'HIGH', country: 'US', rss_url: 'https://www.motherjones.com/feed/' },
  { name: 'Democracy Now', domain: 'democracynow.org', bias: 'LEFT', factual: 'HIGH', country: 'US', rss_url: 'https://www.democracynow.org/democracynow.rss' },
  { name: 'Daily Kos', domain: 'dailykos.com', bias: 'LEFT', factual: 'MIXED', country: 'US', rss_url: 'https://www.dailykos.com/blogs/main.rss' },
  { name: 'Jacobin', domain: 'jacobin.com', bias: 'LEFT', factual: 'HIGH', country: 'US', rss_url: 'https://jacobin.com/feed' },
  { name: 'Common Dreams', domain: 'commondreams.org', bias: 'LEFT', factual: 'HIGH', country: 'US', rss_url: 'https://www.commondreams.org/feeds/feed.rss' },
  { name: 'Salon', domain: 'salon.com', bias: 'LEFT', factual: 'MIXED', country: 'US', rss_url: 'https://www.salon.com/feed/' },

  // LEFT-CENTER
  { name: 'The New York Times', domain: 'nytimes.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
  { name: 'The Washington Post', domain: 'washingtonpost.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://feeds.washingtonpost.com/rss/world' },
  { name: 'CNN', domain: 'cnn.com', bias: 'LEFT-CENTER', factual: 'MOSTLY FACTUAL', country: 'US', rss_url: 'http://rss.cnn.com/rss/cnn_topstories.rss' },
  { name: 'BBC News', domain: 'bbc.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'UK', rss_url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { name: 'NPR', domain: 'npr.org', bias: 'LEFT-CENTER', factual: 'VERY HIGH', country: 'US', rss_url: 'https://feeds.npr.org/1001/rss.xml' },
  { name: 'PBS NewsHour', domain: 'pbs.org', bias: 'LEFT-CENTER', factual: 'VERY HIGH', country: 'US', rss_url: 'https://www.pbs.org/newshour/feeds/rss/headlines' },
  { name: 'ABC News', domain: 'abcnews.go.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://abcnews.go.com/abcnews/internationalheadlines' },
  { name: 'CBS News', domain: 'cbsnews.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://www.cbsnews.com/latest/rss/world' },
  { name: 'Politico', domain: 'politico.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://rss.politico.com/politics-news.xml' },
  { name: 'NBC News', domain: 'nbcnews.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://feeds.nbcnews.com/nbcnews/public/news' },

  // CENTER
  { name: 'Associated Press', domain: 'apnews.com', bias: 'CENTER', factual: 'VERY HIGH', country: 'US', rss_url: 'https://feedx.net/rss/ap.xml' },
  { name: 'Reuters', domain: 'reuters.com', bias: 'CENTER', factual: 'VERY HIGH', country: 'UK', rss_url: 'https://news.google.com/rss/search?q=site:reuters.com+when:1d&hl=en-US&gl=US&ceid=US:en' },
  { name: 'The Hill', domain: 'thehill.com', bias: 'CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://thehill.com/feed/' },
  { name: 'Axios', domain: 'axios.com', bias: 'CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://api.axios.com/feed/' },
  { name: 'Christian Science Monitor', domain: 'csmonitor.com', bias: 'CENTER', factual: 'VERY HIGH', country: 'US', rss_url: 'https://rss.csmonitor.com/feeds/csm' },

  // RIGHT-CENTER
  { name: 'The Wall Street Journal', domain: 'wsj.com', bias: 'RIGHT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml' },
  { name: 'The Economist', domain: 'economist.com', bias: 'RIGHT-CENTER', factual: 'VERY HIGH', country: 'UK', rss_url: 'https://www.economist.com/international/rss.xml' },
  { name: 'Washington Times', domain: 'washingtontimes.com', bias: 'RIGHT-CENTER', factual: 'MIXED', country: 'US', rss_url: 'https://www.washingtontimes.com/rss/headlines/news/' },
  { name: 'National Review', domain: 'nationalreview.com', bias: 'RIGHT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://www.nationalreview.com/feed/' },
  { name: 'RealClearPolitics', domain: 'realclearpolitics.com', bias: 'RIGHT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://www.realclearpolitics.com/index.xml' },
  { name: 'Reason', domain: 'reason.com', bias: 'RIGHT-CENTER', factual: 'HIGH', country: 'US', rss_url: 'https://reason.com/feed/' },

  // RIGHT
  { name: 'Fox News', domain: 'foxnews.com', bias: 'RIGHT', factual: 'MIXED', country: 'US', rss_url: 'https://moxie.foxnews.com/google-publisher/world.xml' },
  { name: 'Daily Wire', domain: 'dailywire.com', bias: 'RIGHT', factual: 'MIXED', country: 'US', rss_url: 'https://www.dailywire.com/feeds/rss.xml' },
  { name: 'New York Post', domain: 'nypost.com', bias: 'RIGHT', factual: 'MIXED', country: 'US', rss_url: 'https://nypost.com/feed/' },
  { name: 'Washington Examiner', domain: 'washingtonexaminer.com', bias: 'RIGHT', factual: 'MOSTLY FACTUAL', country: 'US', rss_url: 'https://www.washingtonexaminer.com/feed' },
  { name: 'Breitbart', domain: 'breitbart.com', bias: 'RIGHT', factual: 'LOW', country: 'US', rss_url: 'https://feeds.feedburner.com/breitbart' },
  { name: 'The Federalist', domain: 'thefederalist.com', bias: 'RIGHT', factual: 'MIXED', country: 'US', rss_url: 'https://thefederalist.com/feed/' },
  { name: 'The Blaze', domain: 'theblaze.com', bias: 'RIGHT', factual: 'MIXED', country: 'US', rss_url: 'https://www.theblaze.com/feeds/feed.rss' },
  { name: 'The Daily Caller', domain: 'dailycaller.com', bias: 'RIGHT', factual: 'MIXED', country: 'US', rss_url: 'https://dailycaller.com/feed/' },

  // INTERNATIONAL
  { name: 'Al Jazeera', domain: 'aljazeera.com', bias: 'LEFT-CENTER', factual: 'MIXED', country: 'QA', rss_url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { name: 'France 24', domain: 'france24.com', bias: 'LEFT-CENTER', factual: 'HIGH', country: 'FR', rss_url: 'https://www.france24.com/en/rss' },
  { name: 'Deutsche Welle', domain: 'dw.com', bias: 'LEFT-CENTER', factual: 'VERY HIGH', country: 'DE', rss_url: 'https://rss.dw.com/rdf/rss-en-all' },
  { name: 'NHK World', domain: 'www3.nhk.or.jp', bias: 'CENTER', factual: 'VERY HIGH', country: 'JP', rss_url: 'https://www3.nhk.or.jp/rss/news/cat0.xml' },
  { name: 'South China Morning Post', domain: 'scmp.com', bias: 'RIGHT-CENTER', factual: 'HIGH', country: 'HK', rss_url: 'https://www.scmp.com/rss/91/feed' },
  { name: 'RT', domain: 'rt.com', bias: 'RIGHT', factual: 'LOW', country: 'RU', rss_url: 'https://www.rt.com/rss/news/' },
  { name: 'The Globe and Mail', domain: 'theglobeandmail.com', bias: 'CENTER', factual: 'HIGH', country: 'CA', rss_url: 'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/world/' },
];

export function getBiasColor(bias: string): string {
  const colors: Record<string, string> = {
    'LEFT': '#3b82f6',
    'LEFT-CENTER': '#60a5fa',
    'CENTER': '#a855f7',
    'RIGHT-CENTER': '#f87171',
    'RIGHT': '#ef4444',
    'FAKE NEWS': '#f59e0b',
    'SATIRE': '#10b981',
    'PRO-SCIENCE': '#06b6d4',
    'CONSPIRACY': '#f59e0b',
  };
  return colors[bias] || '#6b7280';
}

export function getBiasLabel(bias: string): string {
  const labels: Record<string, string> = {
    'LEFT': 'Left',
    'LEFT-CENTER': 'Lean Left',
    'CENTER': 'Center',
    'RIGHT-CENTER': 'Lean Right',
    'RIGHT': 'Right',
  };
  return labels[bias] || bias;
}

export const BIAS_ORDER = ['LEFT', 'LEFT-CENTER', 'CENTER', 'RIGHT-CENTER', 'RIGHT'] as const;
