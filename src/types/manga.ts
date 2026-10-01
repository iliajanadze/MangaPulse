export interface Chapter {
  id: string;
  chapterNumber: string;
  title: string;
  releaseDate: string;
  scanlationGroup?: string;
  pageCount: number;
  pages: string[];
}

export interface Manga {
  id: string;
  title: string;
  altTitle?: string;
  author: string;
  artist?: string;
  coverImage: string;
  bannerImage?: string;
  description: string;
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  genres: string[];
  rating: number;
  views: number;
  latestChapter: string;
  updatedAt: string;
  chapters: Chapter[];
  isFeatured?: boolean;
}

export interface ReadingProgress {
  mangaId: string;
  chapterId: string;
  pageIndex: number;
  lastReadAt: string;
}

export interface Bookmark {
  mangaId: string;
  addedAt: string;
}

export type ReaderMode = 'webtoon' | 'single' | 'double';
export type ReaderTheme = 'dark' | 'light' | 'sepia' | 'oled';

export interface ReaderSettings {
  mode: ReaderMode;
  theme: ReaderTheme;
  fitMode: 'width' | 'height' | 'original';
  zoom: number; // percentage, e.g. 100
  readingDirection: 'ltr' | 'rtl' | 'vertical';
  showPageNumbers: boolean;
}

export interface SyncSource {
  id: string;
  name: string;
  url: string;
  type: 'api' | 'rss' | 'scraper';
  status: 'healthy' | 'warning' | 'idle';
  lastSynced: string;
  mangasTracked: number;
  intervalHours: number;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  source: string;
  message: string;
  mangaTitle?: string;
  chaptersAdded?: number;
}
