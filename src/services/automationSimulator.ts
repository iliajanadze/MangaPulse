import { SyncLogEntry, SyncSource, Chapter } from '../types/manga';

export const DEFAULT_SYNC_SOURCES: SyncSource[] = [
  {
    id: 'src-mangadex',
    name: 'MangaDex Open API (v5)',
    url: 'https://api.mangadex.org',
    type: 'api',
    status: 'healthy',
    lastSynced: '2026-10-01 06:00',
    mangasTracked: 18,
    intervalHours: 6,
  },
  {
    id: 'src-asura',
    name: 'Scanlation RSS Aggregator',
    url: 'https://rss.scanlation-feed.org/latest',
    type: 'rss',
    status: 'healthy',
    lastSynced: '2026-10-01 04:30',
    mangasTracked: 12,
    intervalHours: 12,
  },
  {
    id: 'src-webtoon',
    name: 'Webtoon Scraper Worker',
    url: 'https://worker-manga-sync.workers.dev',
    type: 'scraper',
    status: 'idle',
    lastSynced: '2026-09-30 23:45',
    mangasTracked: 8,
    intervalHours: 24,
  },
];

export const INITIAL_SYNC_LOGS: SyncLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-01 06:00:12',
    level: 'info',
    source: 'MangaDex API',
    message: 'Cron job initiated: Querying updated manga feeds since last check...',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-01 06:00:15',
    level: 'success',
    source: 'MangaDex API',
    message: 'Found 1 new chapter for "Shadow Sovereign": Ch. 182 downloaded & indexed.',
    mangaTitle: 'Shadow Sovereign: Monarch Rise',
    chaptersAdded: 1,
  },
  {
    id: 'log-3',
    timestamp: '2026-10-01 06:00:18',
    level: 'info',
    source: 'Supabase DB',
    message: 'Cache invalidated, 8 image CDN endpoints verified. Pipeline settled.',
  },
];

export const CODE_TEMPLATES = {
  nodejsCron: `// scripts/auto-manga-sync.js
// Runs automatically every day via GitHub Actions or Vercel Cron
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncDailyManga() {
  console.log('[CRON START] Starting automated manga synchronization...');
  
  // 1. Fetch tracked mangas from your database
  const { data: trackedMangas, error } = await supabase
    .from('mangas')
    .select('id, title, mangadex_id, latest_chapter');

  if (error) throw error;

  for (const manga of trackedMangas) {
    try {
      console.log(\`Checking updates for: \${manga.title}...\`);
      
      // 2. Query MangaDex API for latest chapters in English or Georgian
      const res = await axios.get(
        \`https://api.mangadex.org/manga/\${manga.mangadex_id}/feed\`,
        {
          params: {
            translatedLanguage: ['en'],
            order: { chapter: 'desc' },
            limit: 5,
          },
          headers: { 'User-Agent': 'MangaPulse-AutoBot/1.0' }
        }
      );

      const latestApiChapter = res.data.data[0];
      if (!latestApiChapter) continue;

      const newChapterNum = latestApiChapter.attributes.chapter;
      
      // 3. Deduplication check: Is it newer than what we have?
      if (parseFloat(newChapterNum) > parseFloat(manga.latest_chapter || 0)) {
        console.log(\`⚡ NEW CHAPTER FOUND: \${manga.title} Ch. \${newChapterNum}\`);
        
        // 4. Fetch page image URLs from MangaDex At-Home server
        const atHomeRes = await axios.get(
          \`https://api.mangadex.org/at-home/server/\${latestApiChapter.id}\`
        );
        const baseUrl = atHomeRes.data.baseUrl;
        const hash = atHomeRes.data.chapter.hash;
        const pageFiles = atHomeRes.data.chapter.data; // array of filenames

        const pageUrls = pageFiles.map(file => \`\${baseUrl}/data/\${hash}/\${file}\`);

        // 5. Store in Supabase / PostgreSQL database
        await supabase.from('chapters').insert({
          manga_id: manga.id,
          chapter_number: newChapterNum,
          title: latestApiChapter.attributes.title || \`Chapter \${newChapterNum}\`,
          pages: pageUrls,
          release_date: new Date().toISOString(),
        });

        // 6. Update latest chapter on manga record
        await supabase.from('mangas').update({
          latest_chapter: newChapterNum,
          updated_at: new Date().toISOString(),
        }).eq('id', manga.id);

        console.log(\`✅ Successfully saved Ch. \${newChapterNum} with \${pageUrls.length} pages!\`);
      }
    } catch (err) {
      console.error(\`Failed to sync \${manga.title}:\`, err.message);
    }
  }

  console.log('[CRON COMPLETE] All sources synchronized.');
}

syncDailyManga().catch(console.error);
`,

  githubActions: `# .github/workflows/manga-sync.yml
# 100% Free daily cron runner on GitHub Actions (No local computer needed!)
name: Daily Manga Auto-Sync

on:
  schedule:
    # Runs every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allows manual trigger from GitHub UI anytime

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Execute Manga Sync Script
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          DISCORD_WEBHOOK_URL: \${{ secrets.DISCORD_WEBHOOK_URL }} # Optional: alerts your Discord channel
        run: node scripts/auto-manga-sync.js
`,

  vercelCron: `// vercel.json
// If you host your Next.js/Express API on Vercel, use Vercel Cron Jobs:
{
  "crons": [
    {
      "path": "/api/cron/sync-manga",
      "schedule": "0 4 * * *"
    }
  ]
}

// In /api/cron/sync-manga.ts (Route Handler):
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Call sync logic here
  return Response.json({ success: true, timestamp: new Date() });
}
`,

  sqlSchema: `-- PostgreSQL / Supabase Database Schema
-- Run this in your Supabase SQL Editor:

CREATE TABLE mangas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  alt_title TEXT,
  author TEXT NOT NULL,
  mangadex_id TEXT UNIQUE,
  cover_image TEXT,
  description TEXT,
  status TEXT DEFAULT 'Ongoing',
  genres TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  views BIGINT DEFAULT 0,
  latest_chapter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE,
  chapter_number TEXT NOT NULL,
  title TEXT,
  release_date TIMESTAMPTZ DEFAULT NOW(),
  page_count INT DEFAULT 0,
  pages TEXT[] NOT NULL DEFAULT '{}',
  scanlation_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(manga_id, chapter_number)
);

CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  manga_id UUID REFERENCES mangas(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  page_index INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant lookup
CREATE INDEX idx_chapters_manga ON chapters(manga_id, chapter_number DESC);
`,
};
