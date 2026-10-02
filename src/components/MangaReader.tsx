import React, { useState, useEffect, useRef } from 'react';
import { Manga, Chapter, ReaderMode, ReaderTheme, ReaderSettings } from '../types/manga';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Sliders,
  HelpCircle,
  X,
} from 'lucide-react';
import { AdBanner } from './AdBanner';

interface MangaReaderProps {
  manga: Manga;
  chapter: Chapter;
  onClose: () => void;
  onSelectChapter: (manga: Manga, chapter: Chapter) => void;
  onSaveProgress: (mangaId: string, chapterId: string, pageIndex: number) => void;
  initialPageIndex?: number;
}

export const MangaReader: React.FC<MangaReaderProps> = ({
  manga,
  chapter,
  onClose,
  onSelectChapter,
  onSaveProgress,
  initialPageIndex = 0,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPageIndex);
  const [mode, setMode] = useState<ReaderMode>('webtoon');
  const [theme, setTheme] = useState<ReaderTheme>('oled');
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = chapter.pages;
  const totalPages = pages.length;

  // Find previous and next chapters
  const sortedChapters = [...manga.chapters].sort(
    (a, b) => parseFloat(a.chapterNumber) - parseFloat(b.chapterNumber)
  );
  const currentIndex = sortedChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  // Stable ref for onSaveProgress to avoid re-triggering effects
  const onSaveProgressRef = useRef(onSaveProgress);
  useEffect(() => {
    onSaveProgressRef.current = onSaveProgress;
  });

  // Save progress on page or chapter change
  useEffect(() => {
    onSaveProgressRef.current(manga.id, chapter.id, currentPage);
  }, [currentPage, manga.id, chapter.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        goToPrevPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        setShowControls((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.().catch(() => {});
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const goToPrevPage = () => {
    if (mode === 'webtoon') {
      if (currentPage > 0) {
        const target = currentPage - 1;
        setCurrentPage(target);
        pageRefs.current[target]?.scrollIntoView({ behavior: 'smooth' });
      } else if (prevChapter) {
        onSelectChapter(manga, prevChapter);
      }
    } else {
      if (currentPage > 0) {
        setCurrentPage((p) => p - 1);
      } else if (prevChapter) {
        onSelectChapter(manga, prevChapter);
      }
    }
  };

  const goToNextPage = () => {
    if (mode === 'webtoon') {
      if (currentPage < totalPages - 1) {
        const target = currentPage + 1;
        setCurrentPage(target);
        pageRefs.current[target]?.scrollIntoView({ behavior: 'smooth' });
      } else if (nextChapter) {
        onSelectChapter(manga, nextChapter);
      }
    } else {
      if (currentPage < totalPages - 1) {
        setCurrentPage((p) => p + 1);
      } else if (nextChapter) {
        onSelectChapter(manga, nextChapter);
      }
    }
  };

  // Theme styling classes
  const getThemeClass = () => {
    switch (theme) {
      case 'oled':
        return 'bg-black text-neutral-100';
      case 'dark':
        return 'bg-neutral-900 text-neutral-100';
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#433422]';
      case 'light':
        return 'bg-neutral-100 text-neutral-900';
      default:
        return 'bg-black text-neutral-100';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col select-none ${getThemeClass()} transition-colors duration-200`}
    >
      {/* Top Floating Control Bar */}
      <div
        className={`sticky top-0 z-40 flex items-center justify-between border-b px-4 py-2.5 transition-all duration-200 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        } ${
          theme === 'light'
            ? 'bg-white/95 border-neutral-200 text-neutral-800'
            : theme === 'sepia'
            ? 'bg-[#ebdcb9]/95 border-[#d6c49c] text-[#433422]'
            : 'bg-neutral-950/90 border-neutral-800 text-neutral-200'
        } backdrop-blur-md`}
      >
        {/* Left: Back button & Manga Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800/40 transition-colors"
            title="დაბრუნება"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm truncate">
              {manga.title}
            </h3>
            <p className="text-[11px] text-neutral-400 truncate">
              თავი {chapter.chapterNumber}: {chapter.title}
            </p>
          </div>
        </div>

        {/* Center: Chapter Switcher Dropdown */}
        <div className="hidden sm:flex items-center gap-2">
          <select
            value={chapter.id}
            onChange={(e) => {
              const selected = manga.chapters.find((c) => c.id === e.target.value);
              if (selected) {
                setCurrentPage(0);
                onSelectChapter(manga, selected);
              }
            }}
            className={`text-xs font-medium py-1.5 px-3 rounded-lg border focus:outline-none transition-colors ${
              theme === 'light'
                ? 'bg-neutral-50 border-neutral-300 text-neutral-800'
                : 'bg-neutral-900 border-neutral-700 text-neutral-200'
            }`}
          >
            {manga.chapters.map((chap) => (
              <option key={chap.id} value={chap.id}>
                თავი {chap.chapterNumber}: {chap.title}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Controls & Settings */}
        <div className="flex items-center gap-2">
          {/* Shortcuts Info */}
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="p-1.5 rounded-lg hover:bg-neutral-800/40 text-neutral-400 hover:text-neutral-200 transition-colors"
            title="კლავიატურის ღილაკები"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reader Settings Toggle */}
          <button
            onClick={() => setShowSettingsMenu((prev) => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${
              showSettingsMenu ? 'bg-rose-500 text-white' : 'hover:bg-neutral-800/40 text-neutral-300'
            }`}
            title="პარამეტრები"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-neutral-800/40 text-neutral-300 transition-colors"
            title={isFullscreen ? 'სრული ეკრანის გათიშვა' : 'სრული ეკრანი'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Settings Dropdown Overlay */}
      {showSettingsMenu && (
        <div
          className={`absolute top-14 right-4 z-50 w-72 rounded-xl p-4 shadow-2xl border ${
            theme === 'light'
              ? 'bg-white border-neutral-300 text-neutral-800'
              : 'bg-neutral-900 border-neutral-700 text-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-700/50">
            <h4 className="font-semibold text-xs tracking-wider uppercase">საკითხავი რეჟიმები</h4>
            <button
              onClick={() => setShowSettingsMenu(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="pt-3 space-y-2">
            <label className="text-xs text-neutral-400">რეჟიმი:</label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-950/40 rounded-lg">
              <button
                onClick={() => setMode('webtoon')}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                  mode === 'webtoon' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Webtoon (ვერტიკალური)
              </button>
              <button
                onClick={() => setMode('single')}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                  mode === 'single' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                გვერდებად (Single)
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="pt-3 space-y-2">
            <label className="text-xs text-neutral-400">ფონი & თემა:</label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-950/40 rounded-lg text-xs">
              <button
                onClick={() => setTheme('oled')}
                className={`py-1 rounded font-medium ${theme === 'oled' ? 'bg-rose-600 text-white' : 'text-neutral-400'}`}
              >
                OLED
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`py-1 rounded font-medium ${theme === 'dark' ? 'bg-rose-600 text-white' : 'text-neutral-400'}`}
              >
                მუქი
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`py-1 rounded font-medium ${theme === 'sepia' ? 'bg-amber-600 text-white' : 'text-neutral-400'}`}
              >
                სეპია
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`py-1 rounded font-medium ${theme === 'light' ? 'bg-neutral-300 text-neutral-900 font-bold' : 'text-neutral-400'}`}
              >
                ღია
              </button>
            </div>
          </div>

          {/* Zoom Selector */}
          <div className="pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">მასშტაბი:</span>
              <span className="font-mono text-rose-400 font-medium">{zoom}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="50"
                max="160"
                step="5"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-rose-500"
              />
              <button
                onClick={() => setZoom((z) => Math.min(160, z + 10))}
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                title="100% Reset"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Viewport */}
      <div
        className="flex-1 overflow-y-auto relative flex flex-col items-center justify-start focus:outline-none"
        onClick={() => {
          if (showSettingsMenu) setShowSettingsMenu(false);
        }}
      >
        {mode === 'webtoon' ? (
          /* Webtoon Vertical Continuous Strip */
          <div
            className="flex flex-col items-center py-4 transition-all duration-200"
            style={{ width: `${zoom}%`, maxWidth: '950px' }}
          >
            {pages.map((pageUrl, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  pageRefs.current[idx] = el;
                }}
                className="relative w-full shadow-lg mb-2"
                onClick={() => setCurrentPage(idx)}
              >
                <img
                  src={pageUrl}
                  alt={`Page ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain block mx-auto"
                  loading={idx < 2 ? 'eager' : 'lazy'}
                />
                <div className="py-1 text-center text-[10px] text-neutral-400/80 font-mono">
                  {idx + 1} / {totalPages}
                </div>
              </div>
            ))}

            {/* End of Chapter Action Section */}
            <div className="w-full max-w-md my-10 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 text-center space-y-4">
              <h4 className="font-semibold text-sm text-neutral-200">
                თავი {chapter.chapterNumber} დასრულდა!
              </h4>
              <p className="text-xs text-neutral-400">
                ავტომატური სისტემა შეამოწმებს ახალ თავებს ყოველ 6 საათში.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                {prevChapter && (
                  <button
                    onClick={() => onSelectChapter(manga, prevChapter)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium transition-colors"
                  >
                    ← წინა თავი ({prevChapter.chapterNumber})
                  </button>
                )}
                {nextChapter ? (
                  <button
                    onClick={() => onSelectChapter(manga, nextChapter)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium shadow-md transition-colors"
                  >
                    შემდეგი თავი ({nextChapter.chapterNumber}) →
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 transition-colors"
                  >
                    კატალოგში დაბრუნება
                  </button>
                )}
              </div>
            </div>

            {/* Adsterra 728x90 Banner */}
            <div className="w-full max-w-3xl pb-6">
              <AdBanner />
            </div>
          </div>
        ) : (
          /* Single Page Reader with Left/Right Touch Zones */
          <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4">
            {/* Left Touch Hitbox for Previous */}
            <div
              onClick={goToPrevPage}
              className="absolute left-0 top-0 bottom-0 w-1/4 cursor-w-resize z-20 flex items-center pl-4 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="p-3 rounded-full bg-neutral-950/70 text-white shadow-xl">
                <ChevronLeft className="w-6 h-6" />
              </div>
            </div>

            {/* Right Touch Hitbox for Next */}
            <div
              onClick={goToNextPage}
              className="absolute right-0 top-0 bottom-0 w-1/4 cursor-e-resize z-20 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="p-3 rounded-full bg-neutral-950/70 text-white shadow-xl">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>

            {/* Center image container */}
            <div
              className="relative max-h-full flex items-center justify-center transition-all duration-200"
              style={{ width: `${zoom}%`, maxWidth: '900px' }}
            >
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                referrerPolicy="no-referrer"
                className="max-h-[85vh] w-auto max-w-full object-contain rounded shadow-2xl mx-auto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation Bar */}
      <div
        className={`sticky bottom-0 z-40 flex items-center justify-between border-t px-4 py-2.5 transition-all duration-200 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        } ${
          theme === 'light'
            ? 'bg-white/95 border-neutral-200 text-neutral-800'
            : theme === 'sepia'
            ? 'bg-[#ebdcb9]/95 border-[#d6c49c] text-[#433422]'
            : 'bg-neutral-950/90 border-neutral-800 text-neutral-200'
        } backdrop-blur-md`}
      >
        {/* Previous page / chapter button */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0 && !prevChapter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-800/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>წინა</span>
        </button>

        {/* Page Slider & Progress Indicator */}
        <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
          <input
            type="range"
            min="0"
            max={totalPages - 1}
            value={currentPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentPage(val);
              if (mode === 'webtoon') {
                pageRefs.current[val]?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex-1 accent-rose-500 cursor-pointer"
          />
          <span className="font-mono text-xs tabular-nums whitespace-nowrap min-w-[50px] text-center">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        {/* Next page / chapter button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1 && !nextChapter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
        >
          <span>შემდეგი</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-700 p-6 shadow-2xl text-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="font-bold text-sm">კლავიატურის ღილაკები</h4>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">შემდეგი გვერდი:</span>
                <kbd className="px-2 py-1 rounded bg-neutral-800 font-mono text-rose-400">→ ან D</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">წინა გვერდი:</span>
                <kbd className="px-2 py-1 rounded bg-neutral-800 font-mono text-rose-400">← ან A</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">სრული ეკრანი (Fullscreen):</span>
                <kbd className="px-2 py-1 rounded bg-neutral-800 font-mono text-rose-400">F</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">მენიუს დამალვა / გამოჩენა:</span>
                <kbd className="px-2 py-1 rounded bg-neutral-800 font-mono text-rose-400">M</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">გამოსვლა:</span>
                <kbd className="px-2 py-1 rounded bg-neutral-800 font-mono text-rose-400">Esc</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcutsModal(false)}
              className="mt-6 w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
            >
              გასაგებია
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
