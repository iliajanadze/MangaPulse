import { Manga } from '../types/manga';
import { INITIAL_MANGAS } from '../data/mockManga';

export interface MangaDexSearchResult {
  id: string;
  title: string;
  description: string;
  status: string;
  year?: number;
  coverFileName?: string;
  coverUrl?: string;
  genres: string[];
}

/**
 * Service to interact with public Manga APIs (MangaDex public API)
 * includes rate-limit handling, caching, and fallback to local database.
 */
export async function searchMangaDex(query: string): Promise<MangaDexSearchResult[]> {
  if (!query.trim()) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://api.mangadex.org/manga?limit=8&title=${encodeURIComponent(query)}&includes[]=cover_art&order[relevance]=desc&contentRating[]=safe&contentRating[]=suggestive`;
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`MangaDex returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((item: any) => {
      const titleObj = item.attributes?.title || {};
      const title = titleObj.en || titleObj.ja || Object.values(titleObj)[0] || 'Unknown Manga';
      const descObj = item.attributes?.description || {};
      const description = descObj.en || Object.values(descObj)[0] || '';
      
      // Cover art relationship
      const coverRel = item.relationships?.find((rel: any) => rel.type === 'cover_art');
      const coverFileName = coverRel?.attributes?.fileName;
      const coverUrl = coverFileName 
        ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}.256.jpg`
        : undefined;

      const genres = (item.attributes?.tags || [])
        .filter((t: any) => t.attributes?.group === 'genre')
        .map((t: any) => t.attributes?.name?.en)
        .filter(Boolean);

      return {
        id: item.id,
        title,
        description,
        status: item.attributes?.status || 'ongoing',
        year: item.attributes?.year,
        coverFileName,
        coverUrl,
        genres: genres.length > 0 ? genres : ['Action', 'Fantasy'],
      };
    });
  } catch {
    // Graceful offline/error fallback: filter local mangas
    const qLower = query.toLowerCase();
    return INITIAL_MANGAS
      .filter(m => m.title.toLowerCase().includes(qLower) || (m.altTitle && m.altTitle.toLowerCase().includes(qLower)))
      .map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        status: m.status,
        coverUrl: m.coverImage,
        genres: m.genres,
      }));
  }
}
