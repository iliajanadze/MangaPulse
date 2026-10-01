import React from 'react';
import { Manga, Chapter } from '../types/manga';
import { X, Bookmark, Star, Eye, Calendar, BookOpen, ChevronRight, User } from 'lucide-react';

interface MangaDetailModalProps {
  manga: Manga | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectChapter: (manga: Manga, chapter: Chapter) => void;
}

export const MangaDetailModal: React.FC<MangaDetailModalProps> = ({
  manga,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectChapter,
}) => {
  if (!manga) return null;

  const sortedChapters = [...manga.chapters].sort((a, b) => {
    return parseFloat(b.chapterNumber) - parseFloat(a.chapterNumber);
  });

  const firstChapter = sortedChapters[sortedChapters.length - 1];
  const latestChapter = sortedChapters[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl z-10 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-950/70 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Top Manga Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Cover image */}
            <div className="w-36 sm:w-48 aspect-[3/4] shrink-0 rounded-xl overflow-hidden border border-neutral-800 shadow-lg bg-neutral-950">
              <img
                src={manga.coverImage}
                alt={manga.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Main Info */}
            <div className="flex-1 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {manga.title}
              </h2>
              {manga.altTitle && (
                <p className="text-sm font-medium text-rose-400">
                  {manga.altTitle}
                </p>
              )}

              {/* Zero-Pill Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {manga.rating.toFixed(2)}
                </span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="flex items-center gap-1 text-neutral-400">
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="tabular-nums">{manga.views.toLocaleString()}</span> ნახვა
                </span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-emerald-400 font-medium">
                  {manga.status === 'Ongoing' ? 'მიმდინარე' : 'დასრულებული'}
                </span>
              </div>

              {/* Author / Artist */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>ავტორი: <strong className="text-neutral-200">{manga.author}</strong></span>
                {manga.artist && (
                  <>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span>მხატვარი: <strong className="text-neutral-200">{manga.artist}</strong></span>
                  </>
                )}
              </div>

              {/* Genres as clean text */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs text-neutral-300">
                <span className="text-neutral-400">ჟანრები:</span>
                {manga.genres.map((genre, idx) => (
                  <span key={genre}>
                    <span className="text-neutral-200 hover:text-white transition-colors">{genre}</span>
                    {idx < manga.genres.length - 1 && <span className="text-neutral-600 ml-1.5">/</span>}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {latestChapter && (
                  <button
                    onClick={() => onSelectChapter(manga, latestChapter)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    უახლესი თავი ({latestChapter.chapterNumber})
                  </button>
                )}

                {firstChapter && firstChapter.id !== latestChapter?.id && (
                  <button
                    onClick={() => onSelectChapter(manga, firstChapter)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors"
                  >
                    თავი 1-დან დაწყება
                  </button>
                )}

                <button
                  onClick={() => onToggleBookmark(manga.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    isBookmarked
                      ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                      : 'border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'შენახულია ბიბლიოთეკაში' : 'ბიბლიოთეკაში დამატება'}
                </button>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="border-t border-neutral-800/80 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              აღწერა / სიუჟეტი
            </h4>
            <p className="text-sm leading-relaxed text-neutral-300">
              {manga.description}
            </p>
          </div>

          {/* Chapters List */}
          <div className="border-t border-neutral-800/80 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                თავების სია ({manga.chapters.length})
              </h4>
              <span className="text-xs text-neutral-400">
                ავტომატურად განახლებულია: {manga.updatedAt}
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {sortedChapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => onSelectChapter(manga, chap)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-950/60 hover:bg-neutral-800/80 border border-neutral-800/50 transition-colors text-left group"
                >
                  <div>
                    <span className="font-semibold text-sm text-neutral-200 group-hover:text-rose-400 transition-colors">
                      თავი {chap.chapterNumber}: {chap.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>{chap.scanlationGroup || 'MangaDex'}</span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {chap.releaseDate}
                      </span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span>{chap.pageCount} გვერდი</span>
                    </div>
                  </div>

                  <div className="flex items-center text-neutral-400 group-hover:text-rose-400 group-hover:translate-x-1 transition-all">
                    <span className="text-xs font-medium mr-1 hidden sm:inline">წაკითხვა</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
