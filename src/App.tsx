/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Manga, Chapter } from './types/manga';
import { INITIAL_MANGAS } from './data/mockManga';
import { Header } from './components/Header';
import { MangaCard } from './components/MangaCard';
import { MangaDetailModal } from './components/MangaDetailModal';
import { MangaReader } from './components/MangaReader';
import { AutomationDashboard } from './components/AutomationDashboard';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { LibraryView } from './components/LibraryView';
import { searchMangaDex, MangaDexSearchResult } from './services/mangadexService';
import {
  Flame,
  Filter,
  ArrowUpDown,
  BookOpen,
  Info,
  Sparkles,
  Search,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const GENRES = ['ყველა', 'Action', 'Fantasy', 'Sci-Fi', 'Supernatural', 'Adventure', 'Mystery', 'Seinen', 'Shonen'];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'catalog' | 'automation' | 'architecture' | 'library'>('catalog');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ყველა');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Ongoing' | 'Completed'>('all');
  const [sortBy, setSortBy] = useState<'views' | 'rating' | 'latest'>('views');

  // Mangas state (can be updated when automation sync adds new chapters)
  const [mangas, setMangas] = useState<Manga[]>(() => {
    const saved = localStorage.getItem('mangapulse_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MANGAS;
      }
    }
    return INITIAL_MANGAS;
  });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mangapulse_bookmarks');
    return saved ? JSON.parse(saved) : ['manga-solo-monarch', 'manga-cyber-blade'];
  });

  // Reading history
  const [readingHistory, setReadingHistory] = useState<{
    [mangaId: string]: { chapterId: string; pageIndex: number; timestamp: string };
  }>(() => {
    const saved = localStorage.getItem('mangapulse_history');
    return saved
      ? JSON.parse(saved)
      : {
          'manga-solo-monarch': {
            chapterId: 'solo-182',
            pageIndex: 2,
            timestamp: '2026-10-01 07:15',
          },
        };
  });

  // Modal & Reader active states
  const [detailManga, setDetailManga] = useState<Manga | null>(null);
  const [activeReader, setActiveReader] = useState<{
    manga: Manga;
    chapter: Chapter;
    pageIndex: number;
  } | null>(null);

  // Live MangaDex API search state
  const [apiSearchResults, setApiSearchResults] = useState<MangaDexSearchResult[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('mangapulse_catalog', JSON.stringify(mangas));
  }, [mangas]);

  useEffect(() => {
    localStorage.setItem('mangapulse_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('mangapulse_history', JSON.stringify(readingHistory));
  }, [readingHistory]);

  // Handle external search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setApiSearchResults((prev) => (prev.length > 0 ? [] : prev));
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const results = await searchMangaDex(searchQuery);
        setApiSearchResults(results);
      } catch {
        setApiSearchResults([]);
      } finally {
        setIsSearchingApi(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('მანგა წაიშალა ბიბლიოთეკიდან');
        return prev.filter((item) => item !== id);
      } else {
        showToast('მანგა დაემატა თქვენს ბიბლიოთეკას ⭐');
        return [...prev, id];
      }
    });
  };

  const handleSaveProgress = React.useCallback(
    (mangaId: string, chapterId: string, pageIndex: number) => {
      setReadingHistory((prev) => {
        const current = prev[mangaId];
        if (current && current.chapterId === chapterId && current.pageIndex === pageIndex) {
          return prev;
        }
        const now = new Date();
        const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
        return {
          ...prev,
          [mangaId]: {
            chapterId,
            pageIndex,
            timestamp: dateStr,
          },
        };
      });
    },
    []
  );

  // Handle adding simulated new chapter via automation
  const handleChapterAdded = (mangaId: string, newChapterNumber: string) => {
    setMangas((prev) =>
      prev.map((m) => {
        if (m.id === mangaId) {
          // Check if already has chapter
          const alreadyExists = m.chapters.some((c) => c.chapterNumber === newChapterNumber);
          if (alreadyExists) return m;

          const newChapter: Chapter = {
            id: `${mangaId}-${newChapterNumber}`,
            chapterNumber: newChapterNumber,
            title: 'Dawn of the New Era (Automated Sync)',
            releaseDate: new Date().toISOString().split('T')[0],
            scanlationGroup: 'MangaPulse AutoBot',
            pageCount: 8,
            pages: m.chapters[0]?.pages || [],
          };

          return {
            ...m,
            latestChapter: `Ch. ${newChapterNumber}`,
            updatedAt: 'ახლახან განახლდა',
            chapters: [newChapter, ...m.chapters],
          };
        }
        return m;
      })
    );

    showToast(`⚡ ახალი თავი (${newChapterNumber}) წარმატებით დაემატა!`);
  };

  // Filtered & Sorted catalog mangas
  const filteredMangas = useMemo(() => {
    return mangas
      .filter((m) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchAlt = m.altTitle ? m.altTitle.toLowerCase().includes(q) : false;
          const matchAuthor = m.author.toLowerCase().includes(q);
          const matchGenre = m.genres.some((g) => g.toLowerCase().includes(q));
          if (!matchTitle && !matchAlt && !matchAuthor && !matchGenre) return false;
        }

        // Genre filter
        if (selectedGenre !== 'ყველა' && !m.genres.includes(selectedGenre)) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && m.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return b.views - a.views;
        if (sortBy === 'rating') return b.rating - a.rating;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [mangas, searchQuery, selectedGenre, selectedStatus, sortBy]);

  const featuredManga = mangas.find((m) => m.isFeatured) || mangas[0];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-100 text-neutral-900'} transition-colors duration-200`}>
      {/* Top Bar Contract (Zone 1, Zone 2, Zone 3) */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        savedCount={bookmarkedIds.length}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: CATALOG */}
        {currentTab === 'catalog' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Featured Hero Banner (Only when not actively filtering by search) */}
            {!searchQuery && featuredManga && (
              <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-2xl">
                {/* Background Art with gradient scrim */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={featuredManga.coverImage}
                    alt={featuredManga.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center blur-2xl opacity-25 scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
                </div>

                <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-8">
                  {/* Hero Cover */}
                  <div
                    onClick={() => setDetailManga(featuredManga)}
                    className="w-40 sm:w-52 aspect-[3/4] shrink-0 rounded-xl overflow-hidden shadow-2xl border border-neutral-700/60 cursor-pointer group bg-neutral-950"
                  >
                    <img
                      src={featuredManga.coverImage}
                      alt={featuredManga.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Hero Text */}
                  <div className="flex flex-1 flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
                        <Flame className="w-4 h-4 fill-current text-rose-500" />
                        <span>რჩეული მანგა · ტრენდული</span>
                      </div>

                      <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                        {featuredManga.title}
                      </h1>

                      {featuredManga.altTitle && (
                        <p className="text-sm font-medium text-rose-400">
                          {featuredManga.altTitle}
                        </p>
                      )}

                      {/* Zero-Pill Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
                        <span className="font-semibold text-amber-400">⭐ {featuredManga.rating.toFixed(2)}</span>
                        <span aria-hidden="true" className="text-neutral-600">·</span>
                        <span>{featuredManga.latestChapter}</span>
                        <span aria-hidden="true" className="text-neutral-600">·</span>
                        <span>{featuredManga.genres.slice(0, 3).join(' / ')}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 max-w-2xl leading-relaxed pt-1">
                        {featuredManga.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          const latest = featuredManga.chapters[0];
                          if (latest) {
                            setActiveReader({
                              manga: featuredManga,
                              chapter: latest,
                              pageIndex: 0,
                            });
                          }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg transition-transform active:scale-95"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>წაიკითხე {featuredManga.latestChapter}</span>
                      </button>

                      <button
                        onClick={() => setDetailManga(featuredManga)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors"
                      >
                        <Info className="w-4 h-4" />
                        <span>ყველა თავი ({featuredManga.chapters.length})</span>
                      </button>

                      <button
                        onClick={(e) => toggleBookmark(featuredManga.id, e)}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          bookmarkedIds.includes(featuredManga.id)
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white'
                        }`}
                        title="ბიბლიოთეკაში დამატება"
                      >
                        {bookmarkedIds.includes(featuredManga.id) ? '★ შენახულია' : '☆ შენახვა'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter and Controls Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
              {/* Genre Segmented Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 md:pb-0 no-scrollbar">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      selectedGenre === g
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Status and Sort Controls */}
              <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-between md:justify-end">
                {/* Status Toggle */}
                <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedStatus === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                    }`}
                  >
                    ყველა
                  </button>
                  <button
                    onClick={() => setSelectedStatus('Ongoing')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedStatus === 'Ongoing' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                    }`}
                  >
                    მიმდინარე
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-1 text-neutral-400">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="views">პოპულარობით</option>
                    <option value="rating">რეიტინგით</option>
                    <option value="latest">უახლესი</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Manga Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <span>მანგების კატალოგი</span>
                  <span className="text-xs text-neutral-400 font-mono font-normal">
                    ({filteredMangas.length} შედეგი)
                  </span>
                </h2>
              </div>

              {filteredMangas.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
                  <p className="text-neutral-400 text-sm">მოცემული ფილტრით მანგა ვერ მოიძებნა.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('ყველა');
                      setSelectedStatus('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                  >
                    ფილტრების გასუფთავება
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {filteredMangas.map((manga) => (
                    <MangaCard
                      key={manga.id}
                      manga={manga}
                      isBookmarked={bookmarkedIds.includes(manga.id)}
                      onToggleBookmark={toggleBookmark}
                      onSelect={(m) => setDetailManga(m)}
                      onReadLatest={(m, e) => {
                        e.stopPropagation();
                        const latest = m.chapters[0];
                        if (latest) {
                          setActiveReader({
                            manga: m,
                            chapter: latest,
                            pageIndex: 0,
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Live MangaDex Global Search Results (if searching) */}
            {searchQuery && (
              <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    ძიება MangaDex API-ს გლობალურ ბაზაში
                  </h3>
                  {isSearchingApi && (
                    <span className="text-xs text-neutral-400 animate-pulse font-mono">
                      იტვირთება...
                    </span>
                  )}
                </div>

                {apiSearchResults.length === 0 && !isSearchingApi ? (
                  <p className="text-xs text-neutral-400">
                    მსოფლიო ბაზაში პირდაპირი შედეგი არ მოიძებნა.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {apiSearchResults.map((res) => (
                      <div
                        key={res.id}
                        className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex gap-3 text-xs"
                      >
                        {res.coverUrl && (
                          <div className="w-12 h-16 rounded overflow-hidden shrink-0 bg-neutral-900">
                            <img
                              src={res.coverUrl}
                              alt={res.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-neutral-200 truncate">{res.title}</h4>
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
                            {res.description || 'აღწერა არ არის მოწოდებული'}
                          </p>
                          <span className="text-[10px] text-rose-400 block mt-1">
                            {res.status} · {res.genres[0] || 'Manga'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AUTOMATION & CRON ENGINE */}
        {currentTab === 'automation' && (
          <AutomationDashboard onChapterAdded={handleChapterAdded} />
        )}

        {/* TAB 3: ARCHITECTURE GUIDE */}
        {currentTab === 'architecture' && <ArchitectureGuide />}

        {/* TAB 4: MY LIBRARY & HISTORY */}
        {currentTab === 'library' && (
          <LibraryView
            mangas={mangas}
            bookmarkedIds={bookmarkedIds}
            readingHistory={readingHistory}
            onToggleBookmark={toggleBookmark}
            onSelectManga={(m) => setDetailManga(m)}
            onSelectChapter={(m, c) => {
              const savedProgress = readingHistory[m.id];
              const pageIdx = savedProgress?.chapterId === c.id ? savedProgress.pageIndex : 0;
              setActiveReader({ manga: m, chapter: c, pageIndex: pageIdx });
            }}
            onClearHistory={() => {
              setReadingHistory({});
              showToast('ისტორია გასუფთავებულია');
            }}
          />
        )}
      </main>

      {/* Manga Detail Modal */}
      {detailManga && (
        <MangaDetailModal
          manga={detailManga}
          onClose={() => setDetailManga(null)}
          isBookmarked={bookmarkedIds.includes(detailManga.id)}
          onToggleBookmark={(id) => toggleBookmark(id)}
          onSelectChapter={(m, c) => {
            setDetailManga(null);
            const savedProgress = readingHistory[m.id];
            const pageIdx = savedProgress?.chapterId === c.id ? savedProgress.pageIndex : 0;
            setActiveReader({ manga: m, chapter: c, pageIndex: pageIdx });
          }}
        />
      )}

      {/* Fullscreen Manga Reader */}
      {activeReader && (
        <MangaReader
          manga={activeReader.manga}
          chapter={activeReader.chapter}
          initialPageIndex={activeReader.pageIndex}
          onClose={() => setActiveReader(null)}
          onSelectChapter={(m, c) => {
            setActiveReader({ manga: m, chapter: c, pageIndex: 0 });
          }}
          onSaveProgress={handleSaveProgress}
        />
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-semibold text-white shadow-2xl animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
