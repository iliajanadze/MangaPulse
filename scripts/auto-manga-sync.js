/**
 * MangaPulse - Automated Daily Manga Synchronization Script
 * 
 * Runs automatically via GitHub Actions (or local Node.js / VPS).
 * 1. Reads tracked mangas from Supabase.
 * 2. Fetches latest chapters from MangaDex API.
 * 3. Compares chapter numbers to detect new releases.
 * 4. Resolves image URLs from MangaDex At-Home server cluster.
 * 5. Writes new chapters to Supabase.
 */

import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper delay to respect MangaDex rate limits (5 requests per second)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runMangaSync() {
  console.log('====================================================');
  console.log(`🚀 [CRON START] MangaPulse Auto-Sync at ${new Date().toISOString()}`);
  console.log('====================================================');

  try {
    // 1. Fetch tracked mangas with a MangaDex ID
    let { data: mangas, error: fetchErr } = await supabase
      .from('mangas')
      .select('id, title, mangadex_id, latest_chapter')
      .not('mangadex_id', 'is', null);

    if (fetchErr) {
      throw new Error(`Failed to fetch mangas from Supabase: ${fetchErr.message}`);
    }

    if (!mangas || mangas.length === 0) {
      console.log('ℹ️ No tracked mangas found in database. Auto-seeding top popular titles...');
      const seedList = [
        { title: 'Solo Leveling', alt_title: 'სოლო ლეველინგი', author: 'Chugong', mangadex_id: '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0', status: 'Completed', genres: ['Action', 'Fantasy'] },
        { title: 'One Piece', alt_title: 'ვან პისი', author: 'Eiichiro Oda', mangadex_id: 'a1c7c817-4e59-43b7-9365-09675a149a6f', status: 'Ongoing', genres: ['Adventure', 'Action', 'Shonen'] },
        { title: 'Jujutsu Kaisen', alt_title: 'ჯუჯუცუ კაისენი', author: 'Gege Akutami', mangadex_id: 'c52b2ce3-7f95-469c-96b1-6d8452151ce2', status: 'Completed', genres: ['Action', 'Supernatural'] },
        { title: 'Chainsaw Man', alt_title: 'ბენზოხერხა ადამიანი', author: 'Tatsuki Fujimoto', mangadex_id: 'a77742b1-edd9-4bb8-a562-6dd4e7272802', status: 'Ongoing', genres: ['Action', 'Dark Fantasy'] },
        { title: 'Berserk', alt_title: 'ბერსერკი', author: 'Kentaro Miura', mangadex_id: '801513ba-a712-4985-8cdd-c697748107ac', status: 'Ongoing', genres: ['Dark Fantasy', 'Seinen'] },
      ];
      await supabase.from('mangas').upsert(seedList, { onConflict: 'mangadex_id' });
      const { data: refreshed } = await supabase.from('mangas').select('id, title, mangadex_id, latest_chapter').not('mangadex_id', 'is', null);
      mangas = refreshed || [];
    }

    console.log(`📋 Found ${mangas.length} mangas to inspect.\n`);

    let totalChaptersAdded = 0;

    for (const manga of mangas) {
      console.log(`🔍 Checking updates for: "${manga.title}" (ID: ${manga.mangadex_id})`);

      try {
        // 2. Query MangaDex API for latest English chapters
        const feedUrl = `https://api.mangadex.org/manga/${manga.mangadex_id}/feed`;
        const feedResponse = await axios.get(feedUrl, {
          params: {
            translatedLanguage: ['en'],
            order: { chapter: 'desc' },
            limit: 5,
            contentRating: ['safe', 'suggestive'],
          },
          headers: {
            'User-Agent': 'MangaPulse-AutoBot/1.0 (https://github.com/iliajanadze999/mangapulse)',
          },
          timeout: 10000,
        });

        const chaptersList = feedResponse.data?.data || [];
        if (chaptersList.length === 0) {
          console.log(`   ↳ No chapters found on MangaDex for this manga.`);
          await sleep(500);
          continue;
        }

        const latestChapterItem = chaptersList[0];
        const latestNumStr = latestChapterItem.attributes?.chapter;
        if (!latestNumStr) {
          console.log(`   ↳ Skipping item with missing chapter number.`);
          continue;
        }

        const currentSavedNum = parseFloat(manga.latest_chapter || '0');
        const incomingNum = parseFloat(latestNumStr);

        console.log(`   ↳ Current in DB: Ch. ${currentSavedNum} | Latest on MangaDex: Ch. ${incomingNum}`);

        // 3. Deduplication Check
        if (incomingNum > currentSavedNum) {
          console.log(`   ⚡ [NEW RELEASE DETECTED] Chapter ${latestNumStr}! Fetching pages...`);

          // 4. Request At-Home Server details for page filenames
          await sleep(350);
          const atHomeUrl = `https://api.mangadex.org/at-home/server/${latestChapterItem.id}`;
          const atHomeRes = await axios.get(atHomeUrl, { timeout: 10000 });

          const baseUrl = atHomeRes.data?.baseUrl;
          const chapterHash = atHomeRes.data?.chapter?.hash;
          const pageFiles = atHomeRes.data?.chapter?.data || [];

          if (!baseUrl || !chapterHash || pageFiles.length === 0) {
            console.warn(`   ⚠️ Warning: Could not resolve page image filenames.`);
            continue;
          }

          // Build reliable CDN URLs (directly hosted by MangaDex At-Home network)
          const pageUrls = pageFiles.map(
            (filename) => `${baseUrl}/data/${chapterHash}/${filename}`
          );

          const chapterTitle =
            latestChapterItem.attributes?.title || `Chapter ${latestNumStr}`;
          const publishDate =
            latestChapterItem.attributes?.publishAt || new Date().toISOString();

          // 5. Insert new chapter into Supabase
          const { error: insertErr } = await supabase.from('chapters').upsert(
            {
              manga_id: manga.id,
              chapter_number: latestNumStr,
              title: chapterTitle,
              pages: pageUrls,
              page_count: pageUrls.length,
              release_date: publishDate,
              scanlation_group: 'MangaDex Community',
            },
            { onConflict: 'manga_id, chapter_number' }
          );

          if (insertErr) {
            console.error(`   ❌ Failed to insert chapter into DB:`, insertErr.message);
          } else {
            // 6. Update latest chapter on manga row
            await supabase
              .from('mangas')
              .update({
                latest_chapter: `Ch. ${latestNumStr}`,
                updated_at: new Date().toISOString(),
              })
              .eq('id', manga.id);

            console.log(`   ✅ Saved Chapter ${latestNumStr} (${pageUrls.length} pages) successfully!`);
            totalChaptersAdded++;
          }
        } else {
          console.log(`   ✓ Up to date.`);
        }
      } catch (mangaErr) {
        console.error(`   ❌ Error querying manga "${manga.title}":`, mangaErr.message);
      }

      // Respect rate-limits between mangas
      await sleep(1000);
    }

    console.log('\n====================================================');
    console.log(`🏁 [SYNC FINISHED] Processed ${mangas.length} titles. Added ${totalChaptersAdded} new chapters.`);
    console.log('====================================================');
  } catch (err) {
    console.error('💥 Fatal error in sync execution:', err.message);
    process.exit(1);
  }
}

runMangaSync();
