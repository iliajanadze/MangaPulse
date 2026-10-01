import React from 'react';
import { Manga } from '../types/manga';
import { Bookmark, Star, BookOpen, Clock } from 'lucide-react';

interface MangaCardProps {
  manga: Manga;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelect: (manga: Manga) => void;
  onReadLatest: (manga: Manga, e: React.MouseEvent) => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  isBookmarked,
  onToggleBookmark,
  onSelect,
  onReadLatest,
}) => {
  return (
    <article
      onClick={() => onSelect(manga)}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 cursor-pointer hover:-translate-y-1 shadow-sm"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={manga.coverImage}
          alt={manga.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Subtle contrast scrim at bottom of cover */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

        {/* Top actions: Bookmark button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={(e) => onToggleBookmark(manga.id, e)}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isBookmarked
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-neutral-900/70 text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
            title={isBookmarked ? 'შენახულია' : 'შენახვა ბიბლიოთეკაში'}
            aria-label="Toggle Bookmark"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Status indicator (unboxed) in bottom cover */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-neutral-300 font-medium">
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="tabular-nums font-semibold">{manga.rating.toFixed(2)}</span>
          </span>
          <span className="text-neutral-300 text-[11px] truncate max-w-[130px]">
            {manga.latestChapter}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug text-neutral-100 group-hover:text-rose-400 transition-colors line-clamp-1">
          {manga.title}
        </h3>

        {manga.altTitle && (
          <p className="mt-0.5 text-xs text-neutral-400 line-clamp-1">
            {manga.altTitle}
          </p>
        )}

        {/* Zero-Pill Metadata with typographic dot separators */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
          <span>{manga.genres[0]}</span>
          {manga.genres[1] && (
            <>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{manga.genres[1]}</span>
            </>
          )}
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>{manga.status === 'Ongoing' ? 'მიმდინარე' : 'დასრულებული'}</span>
        </div>

        {/* Bottom card footer with quick read button */}
        <div className="mt-auto pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-neutral-400">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span className="truncate max-w-[90px]">{manga.updatedAt.split(' ')[0]}</span>
          </span>

          <button
            onClick={(e) => onReadLatest(manga, e)}
            className="flex items-center gap-1 font-medium text-rose-400 hover:text-rose-300 py-1 px-2 rounded hover:bg-rose-500/10 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            წაკითხვა
          </button>
        </div>
      </div>
    </article>
  );
};
