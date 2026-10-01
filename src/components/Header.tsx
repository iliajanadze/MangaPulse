import React from 'react';
import { Search, Bookmark, Cpu, BookOpen, Sun, Moon, Layers } from 'lucide-react';

interface HeaderProps {
  currentTab: 'catalog' | 'automation' | 'architecture' | 'library';
  onSelectTab: (tab: 'catalog' | 'automation' | 'architecture' | 'library') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title, single line text element wordmark */}
        <button
          onClick={() => onSelectTab('catalog')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-xl font-extrabold tracking-tight text-white group-hover:text-rose-500 transition-colors">
            Manga<span className="text-rose-500">Pulse</span>
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links, single line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`cursor-pointer transition-colors py-1 ${
              currentTab === 'catalog'
                ? 'text-white font-semibold border-b-2 border-rose-500'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            კატალოგი
          </button>
          <button
            onClick={() => onSelectTab('automation')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'automation'
                ? 'text-white font-semibold border-b-2 border-rose-500'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Cpu className="w-4 h-4 text-rose-400" />
            ავტომატიზაცია & Cron
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'architecture'
                ? 'text-white font-semibold border-b-2 border-rose-500'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            არქიტექტურის გზამკვლევი
          </button>
          <button
            onClick={() => onSelectTab('library')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'library'
                ? 'text-white font-semibold border-b-2 border-rose-500'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            ბიბლიოთეკა
            {savedCount > 0 && (
              <span className="text-xs text-rose-400 font-mono">({savedCount})</span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Quick search input */}
          <div className="relative w-44 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="მოძებნე მანგა..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded-lg transition-colors"
            title={isDark ? 'სინათლის რეჟიმი' : 'მუქი რეჟიმი'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="flex md:hidden border-t border-neutral-900 px-4 py-2 bg-neutral-950 overflow-x-auto gap-4 text-xs font-medium no-scrollbar">
        <button
          onClick={() => onSelectTab('catalog')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            currentTab === 'catalog' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
          }`}
        >
          კატალოგი
        </button>
        <button
          onClick={() => onSelectTab('automation')}
          className={`whitespace-nowrap px-2 py-1 rounded flex items-center gap-1 ${
            currentTab === 'automation' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-rose-400" />
          ავტომატიზაცია
        </button>
        <button
          onClick={() => onSelectTab('architecture')}
          className={`whitespace-nowrap px-2 py-1 rounded flex items-center gap-1 ${
            currentTab === 'architecture' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          არქიტექტურა
        </button>
        <button
          onClick={() => onSelectTab('library')}
          className={`whitespace-nowrap px-2 py-1 rounded flex items-center gap-1 ${
            currentTab === 'library' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          ბიბლიოთეკა {savedCount > 0 ? `(${savedCount})` : ''}
        </button>
      </div>
    </header>
  );
};
