# NewsLens — Self-Hosted Ground News Clone

See how news stories are covered across the political spectrum. Groups articles by topic, shows bias breakdown, and detects blindspots.

## Features

- **Story clustering** — TF-IDF + cosine similarity groups related articles
- **Bias spectrum bar** — Visual breakdown of Left/Center/Right coverage per story
- **Blindspot detection** — Flags stories only covered by one political side
- **40+ RSS sources** across the bias spectrum with MBFC ratings
- **Source directory** — Browse all tracked sources with bias/factual ratings
- **Dark mode** — Easy on the eyes
- **No API keys** — Uses free RSS feeds, runs fully offline after initial fetch

## Quick Start

```bash
npm install
npm run setup    # Seeds bias data + fetches initial articles
npm run dev      # Start dev server at http://localhost:3000
```

## Periodic Updates

```bash
npm run fetch-articles   # Fetch new articles and re-cluster
```

Set up a cron job for automatic updates:
```bash
*/30 * * * * cd /path/to/ground-news-clone && npm run fetch-articles
```

Or trigger via API: `POST /api/fetch`

## Tech Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- SQLite via better-sqlite3
- RSS feeds from 40+ major news outlets
- TF-IDF clustering (no external AI needed)

## Source Bias Ratings

Based on Media Bias Fact Check (MBFC) data. Sources span:
- **Left:** The Guardian, HuffPost, MSNBC, The Intercept, Mother Jones, Democracy Now
- **Left-Center:** NYT, WaPo, CNN, BBC, NPR, AP, PBS, Al Jazeera
- **Center:** AP, Reuters, The Hill, USA Today, Axios
- **Right-Center:** WSJ, The Economist, Forbes, National Review
- **Right:** Fox News, Daily Wire, NY Post, Breitbart, The Federalist
- **International:** RT, France24, Deutsche Welle, NHK, SCMP
