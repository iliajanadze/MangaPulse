import React from 'react';
import { Manga, Chapter } from '../types/manga';
import { MangaCard } from './MangaCard';
import { Bookmark, Clock, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface LibraryViewProps {
  mangas: Manga[];
  bookmarkedIds: string[];
  readingHistory: { [mangaId: string]: { chapterId: string; pageIndex: number; timestamp: string } };
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onSelectManga: (manga: Manga) => void;
  onSelectChapter: (manga: Manga, chapter: Chapter) => void;
  onClearHistory: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  mangas,
  bookmarkedIds,
  readingHistory,
  onToggleBookmark,
  onSelectManga,
  onSelectChapter,
  onClearHistory,
}) => {
  const bookmarkedMangas = mangas.filter((m) => bookmarkedIds.includes(m.id));

  // Mangas that have reading history entries
  const historyItems = Object.entries(readingHistory)
    .map(([mangaId, progress]) => {
      const manga = mangas.find((m) => m.id === mangaId);
      if (!manga) return null;
      const chapter = manga.chapters.find((c) => c.id === progress.chapterId) || manga.chapters[0];
      return {
        manga,
        chapter,
        pageIndex: progress.pageIndex,
        timestamp: progress.timestamp,
      };
    })
    .filter(Boolean) as {
    manga: Manga;
    chapter: Chapter;
    pageIndex: number;
    timestamp: string;
  }[];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Reading History Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              ბოლოს წაკითხული (Reading History)
            </h3>
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              ისტორიის გასუფთავება
            </button>
          )}
        </div>

        {historyItems.length === 0 ? (
          <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-sm text-neutral-400">ისტორია ჯერ ცარიელია.</p>
            <p className="text-xs text-neutral-500">
              როგორც კი დაიწყებთ რომელიმე მანგის კითხვას, თქვენი პროგრესი აქ შეინახება.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyItems.map(({ manga, chapter, pageIndex, timestamp }) => (
              <div
                key={manga.id}
                className="flex gap-4 p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-colors group"
              >
                <div
                  onClick={() => onSelectManga(manga)}
                  className="w-16 h-22 rounded-lg overflow-hidden shrink-0 cursor-pointer bg-neutral-950"
                >
                  <img
                    src={manga.coverImage}
                    alt={manga.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4
                      onClick={() => onSelectManga(manga)}
                      className="text-xs sm:text-sm font-semibold text-neutral-200 hover:text-rose-400 cursor-pointer truncate"
                    >
                      {manga.title}
                    </h4>
                    <p className="text-xs text-rose-400 font-medium mt-0.5">
                      თავი {chapter.chapterNumber} · გვერდი {pageIndex + 1}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {timestamp}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectChapter(manga, chapter)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg w-fit transition-colors shadow-sm"
                  >
                    <span>კითხვის გაგრძელება</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookmarked Manga Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-rose-400 fill-current" />
            <h3 className="text-base font-bold text-white tracking-tight">
              შენახული მანგები (Saved Bookmarks)
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {bookmarkedMangas.length} მანგა
          </span>
        </div>

        {bookmarkedMangas.length === 0 ? (
          <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-center space-y-2">
            <Bookmark className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-sm text-neutral-400">ბიბლიოთეკაში არაფერია შენახული.</p>
            <p className="text-xs text-neutral-500">
              დააჭირეთ სანიშნის ღილაკს ნებისმიერ მანგაზე მის აქ შესანახად.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bookmarkedMangas.map((manga) => (
              <MangaCard
                key={manga.id}
                manga={manga}
                isBookmarked={true}
                onToggleBookmark={(id, e) => onToggleBookmark(id, e)}
                onSelect={(m) => onSelectManga(m)}
                onReadLatest={(m, e) => {
                  e.stopPropagation();
                  const latest = m.chapters[0];
                  if (latest) onSelectChapter(m, latest);
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
