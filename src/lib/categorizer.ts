// Keyword-based article categorizer
// Assigns a primary category and normalized tags to each article

export const CATEGORIES = [
  { id: 'war-conflict', label: 'War & Conflict', emoji: '⚔️', color: '#ef4444' },
  { id: 'politics', label: 'Politics', emoji: '🏛️', color: '#8b5cf6' },
  { id: 'world', label: 'World', emoji: '🌍', color: '#3b82f6' },
  { id: 'business', label: 'Business', emoji: '💼', color: '#10b981' },
  { id: 'tech', label: 'Technology', emoji: '💻', color: '#06b6d4' },
  { id: 'science', label: 'Science', emoji: '🔬', color: '#a855f7' },
  { id: 'health', label: 'Health', emoji: '🏥', color: '#ec4899' },
  { id: 'climate', label: 'Climate & Environment', emoji: '🌱', color: '#22c55e' },
  { id: 'economy', label: 'Economy', emoji: '📊', color: '#f59e0b' },
  { id: 'crime', label: 'Crime & Justice', emoji: '⚖️', color: '#f97316' },
  { id: 'sports', label: 'Sports', emoji: '🏆', color: '#84cc16' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#d946ef' },
  { id: 'opinion', label: 'Opinion', emoji: '💬', color: '#6b7280' },
  { id: 'general', label: 'General', emoji: '📰', color: '#71717a' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

// Keyword patterns for each category (checked against title + description)
// Higher weight = more specific. Matched in order, first strong match wins.
const CATEGORY_RULES: { category: CategoryId; keywords: string[]; weight: number }[] = [
  // War & Conflict — check first, very specific
  { category: 'war-conflict', weight: 3, keywords: [
    'war', 'airstrike', 'airstrikes', 'missile', 'missiles', 'bombing', 'bombed', 'shelling',
    'invasion', 'troops', 'military strike', 'drone strike', 'ceasefire', 'casualties',
    'combat', 'battlefield', 'offensive', 'artillery', 'warship', 'navy attack',
    'iran war', 'iran strike', 'hezbollah', 'hamas', 'idf', 'irgc', 'centcom',
    'killed in strike', 'air defense', 'torpedo', 'pentagon', 'nato strike',
    'strait of hormuz', 'nuclear facility', 'khamenei', 'netanyahu military',
  ]},

  // Politics
  { category: 'politics', weight: 2, keywords: [
    'president', 'congress', 'senate', 'senator', 'republican', 'democrat', 'gop',
    'white house', 'biden', 'trump', 'election', 'vote', 'voting', 'ballot',
    'legislation', 'bill passes', 'supreme court', 'executive order', 'impeach',
    'political', 'parliament', 'prime minister', 'governor', 'campaign',
    'policy', 'bipartisan', 'filibuster', 'lobby', 'cabinet', 'veto',
    'state department', 'foreign policy', 'diplomacy', 'diplomat', 'ambassador',
    'sanctions', 'treaty', 'summit', 'g7', 'g20', 'united nations', 'un security',
  ]},

  // Economy
  { category: 'economy', weight: 2, keywords: [
    'inflation', 'interest rate', 'federal reserve', 'fed rate', 'gdp',
    'recession', 'unemployment', 'jobs report', 'labor market', 'wage',
    'debt ceiling', 'deficit', 'fiscal', 'monetary policy', 'treasury',
    'stock market', 'dow jones', 'nasdaq', 's&p 500', 'wall street crash',
    'oil price', 'crude oil', 'gas prices', 'commodity', 'tariff', 'trade war',
    'economic growth', 'cost of living', 'housing market', 'mortgage rate',
  ]},

  // Business
  { category: 'business', weight: 2, keywords: [
    'ceo', 'ipo', 'merger', 'acquisition', 'startup', 'revenue', 'profit',
    'earnings', 'quarterly', 'shareholders', 'stock', 'shares', 'market cap',
    'billion deal', 'layoffs', 'restructuring', 'bankruptcy', 'antitrust',
    'apple', 'google', 'amazon', 'microsoft', 'tesla', 'meta', 'nvidia',
    'corporate', 'business', 'company', 'industry', 'venture capital',
  ]},

  // Technology
  { category: 'tech', weight: 2, keywords: [
    'artificial intelligence', ' ai ', 'chatgpt', 'openai', 'machine learning',
    'cybersecurity', 'hack', 'data breach', 'ransomware', 'encryption',
    'social media', 'tiktok', 'instagram', 'twitter', 'facebook',
    'cryptocurrency', 'bitcoin', 'blockchain', 'crypto',
    'smartphone', 'iphone', 'android', 'app store', 'software', 'chip',
    'semiconductor', 'quantum computing', 'spacex', 'satellite', 'robot',
    'silicon valley', 'tech company', 'algorithm', 'deepfake', 'autonomous',
  ]},

  // Science
  { category: 'science', weight: 2, keywords: [
    'nasa', 'space', 'asteroid', 'mars', 'moon landing', 'telescope',
    'discovery', 'researchers', 'study finds', 'scientists', 'physics',
    'genome', 'dna', 'evolution', 'fossil', 'species', 'archaeology',
    'experiment', 'laboratory', 'peer review', 'journal', 'breakthrough',
  ]},

  // Health
  { category: 'health', weight: 2, keywords: [
    'covid', 'pandemic', 'vaccine', 'virus', 'outbreak', 'epidemic',
    'hospital', 'patients', 'doctor', 'medical', 'fda', 'who ',
    'drug', 'pharmaceutical', 'treatment', 'clinical trial', 'cancer',
    'mental health', 'disease', 'public health', 'healthcare', 'diagnosis',
    'surgery', 'cdc', 'infection', 'symptom', 'medication',
  ]},

  // Climate & Environment
  { category: 'climate', weight: 2, keywords: [
    'climate change', 'global warming', 'carbon emission', 'greenhouse',
    'renewable energy', 'solar', 'wind power', 'electric vehicle', 'ev ',
    'wildfire', 'hurricane', 'flood', 'drought', 'earthquake', 'tsunami',
    'pollution', 'deforestation', 'endangered species', 'biodiversity',
    'paris agreement', 'cop28', 'net zero', 'fossil fuel', 'sustainability',
    'environmental', 'ecology', 'conservation', 'ocean', 'glacier',
  ]},

  // Crime & Justice
  { category: 'crime', weight: 2, keywords: [
    'murder', 'shooting', 'arrested', 'indicted', 'convicted', 'trial',
    'prison', 'jail', 'sentencing', 'verdict', 'jury', 'prosecutor',
    'fbi', 'investigation', 'suspect', 'victim', 'homicide', 'assault',
    'robbery', 'fraud', 'trafficking', 'gang', 'cartel', 'drug bust',
    'death penalty', 'parole', 'crime rate', 'law enforcement', 'police',
    'lawsuit', 'attorney general', 'justice department', 'doj',
  ]},

  // Sports
  { category: 'sports', weight: 2, keywords: [
    'nfl', 'nba', 'mlb', 'nhl', 'soccer', 'football', 'basketball',
    'baseball', 'hockey', 'tennis', 'golf', 'olympics', 'world cup',
    'championship', 'playoffs', 'tournament', 'coach', 'athlete',
    'team', 'score', 'game', 'match', 'season', 'draft', 'mvp',
    'premier league', 'champions league', 'super bowl', 'fifa',
    'espn', 'stadium', 'roster',
  ]},

  // Entertainment
  { category: 'entertainment', weight: 2, keywords: [
    'movie', 'film', 'netflix', 'disney', 'hollywood', 'box office',
    'tv show', 'series', 'streaming', 'celebrity', 'actor', 'actress',
    'album', 'concert', 'grammy', 'oscar', 'emmy', 'award show',
    'music', 'singer', 'band', 'viral', 'tiktok trend', 'influencer',
    'reality tv', 'book', 'bestseller', 'podcast', 'gaming', 'video game',
  ]},

  // Opinion
  { category: 'opinion', weight: 1, keywords: [
    'opinion', 'editorial', 'op-ed', 'column', 'commentary', 'perspective',
    'analysis', 'take', 'argues', 'my view', 'i think', 'should we',
  ]},
];

// Tag normalization — maps raw tags/keywords to standardized tags
const TAG_ALIASES: Record<string, string> = {
  'us': 'united-states', 'usa': 'united-states', 'america': 'united-states', 'u.s.': 'united-states',
  'uk': 'united-kingdom', 'britain': 'united-kingdom', 'england': 'united-kingdom',
  'ai': 'artificial-intelligence', 'chatgpt': 'artificial-intelligence', 'openai': 'artificial-intelligence',
  'gop': 'republican-party', 'republicans': 'republican-party',
  'dems': 'democratic-party', 'democrats': 'democratic-party',
  'covid': 'covid-19', 'coronavirus': 'covid-19',
  'crypto': 'cryptocurrency', 'bitcoin': 'cryptocurrency',
  'ev': 'electric-vehicles', 'evs': 'electric-vehicles',
  'scotus': 'supreme-court',
  'potus': 'president',
  'climate': 'climate-change', 'global warming': 'climate-change',
};

// Extract entity-like tags from text
const TAG_PATTERNS: { pattern: RegExp; tag: string }[] = [
  { pattern: /\biran\b/i, tag: 'iran' },
  { pattern: /\bisrael\b/i, tag: 'israel' },
  { pattern: /\bruss?ia\b/i, tag: 'russia' },
  { pattern: /\bukraine\b/i, tag: 'ukraine' },
  { pattern: /\bchina\b/i, tag: 'china' },
  { pattern: /\bnorth korea\b/i, tag: 'north-korea' },
  { pattern: /\btrump\b/i, tag: 'trump' },
  { pattern: /\bbiden\b/i, tag: 'biden' },
  { pattern: /\bnetanyahu\b/i, tag: 'netanyahu' },
  { pattern: /\bputin\b/i, tag: 'putin' },
  { pattern: /\bzelensky\b/i, tag: 'zelensky' },
  { pattern: /\bhezbollah\b/i, tag: 'hezbollah' },
  { pattern: /\bhamas\b/i, tag: 'hamas' },
  { pattern: /\bgaza\b/i, tag: 'gaza' },
  { pattern: /\bsyria\b/i, tag: 'syria' },
  { pattern: /\btaiwan\b/i, tag: 'taiwan' },
  { pattern: /\bnato\b/i, tag: 'nato' },
  { pattern: /\beuropean union\b|\beu\b/i, tag: 'european-union' },
  { pattern: /\bsupreme court\b/i, tag: 'supreme-court' },
  { pattern: /\bcongress\b/i, tag: 'congress' },
  { pattern: /\bfederal reserve\b|\bthe fed\b/i, tag: 'federal-reserve' },
  { pattern: /\bpentagon\b/i, tag: 'pentagon' },
  { pattern: /\bcdc\b/i, tag: 'cdc' },
  { pattern: /\bfbi\b/i, tag: 'fbi' },
  { pattern: /\bcIA\b/i, tag: 'cia' },
  { pattern: /\btesla\b/i, tag: 'tesla' },
  { pattern: /\bapple\b(?!\s+(pie|cider|sauce|tree|juice))/i, tag: 'apple' },
  { pattern: /\bgoogle\b/i, tag: 'google' },
  { pattern: /\bmicrosoft\b/i, tag: 'microsoft' },
  { pattern: /\bamazon\b(?!\s+(rain|forest|river))/i, tag: 'amazon' },
  { pattern: /\bnvidia\b/i, tag: 'nvidia' },
  { pattern: /\bimmigration\b/i, tag: 'immigration' },
  { pattern: /\bgun\s*(control|violence|law|reform)\b/i, tag: 'gun-policy' },
  { pattern: /\babortion\b|\broe\b/i, tag: 'abortion' },
  { pattern: /\bclimate\b/i, tag: 'climate-change' },
  { pattern: /\boil\s*price\b|\bcrude\s*oil\b|\bbrent\b/i, tag: 'oil-prices' },
  { pattern: /\bstrait of hormuz\b/i, tag: 'strait-of-hormuz' },
];

export function categorizeArticle(title: string, description: string = '', url: string = ''): { category: CategoryId; tags: string[] } {
  const text = `${title} ${description}`.toLowerCase();
  const urlLower = url.toLowerCase();

  // Try URL-based category hints first (many RSS feeds have category in URL)
  const urlCategory = getCategoryFromUrl(urlLower);

  // Score each category by keyword matches
  let bestCategory: CategoryId = 'general';
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += rule.weight;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  // URL hint as tiebreaker for general
  if (bestCategory === 'general' && urlCategory) {
    bestCategory = urlCategory;
  }

  // Extract tags
  const tags = new Set<string>();
  for (const { pattern, tag } of TAG_PATTERNS) {
    if (pattern.test(text)) tags.add(tag);
  }

  // Normalize any raw tags
  for (const tag of [...tags]) {
    const normalized = TAG_ALIASES[tag];
    if (normalized && normalized !== tag) {
      tags.delete(tag);
      tags.add(normalized);
    }
  }

  return { category: bestCategory, tags: [...tags] };
}

function getCategoryFromUrl(url: string): CategoryId | null {
  if (/\/(war|conflict|military|defense)/.test(url)) return 'war-conflict';
  if (/\/(politic|government|election|congress|senate)/.test(url)) return 'politics';
  if (/\/(business|finance|market|money)/.test(url)) return 'business';
  if (/\/(tech|technology|digital|cyber|ai|computing)/.test(url)) return 'tech';
  if (/\/(science|space|research|nature)/.test(url)) return 'science';
  if (/\/(health|medical|wellness|covid)/.test(url)) return 'health';
  if (/\/(climate|environment|energy|green)/.test(url)) return 'climate';
  if (/\/(economy|economic|inflation|trade)/.test(url)) return 'economy';
  if (/\/(crime|justice|law|court|legal|police)/.test(url)) return 'crime';
  if (/\/(sport|nfl|nba|mlb|soccer|football|basketball)/.test(url)) return 'sports';
  if (/\/(entertainment|culture|movie|music|celebrity|arts)/.test(url)) return 'entertainment';
  if (/\/(opinion|editorial|commentary|op-ed|perspective)/.test(url)) return 'opinion';
  if (/\/(world|international|global|foreign|middleeast|asia|europe|africa|americas)/.test(url)) return 'world';
  return null;
}

export function getCategoryInfo(id: string) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}
