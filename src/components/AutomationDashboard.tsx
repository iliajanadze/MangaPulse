import React, { useState } from 'react';
import { SyncSource, SyncLogEntry, Manga } from '../types/manga';
import { DEFAULT_SYNC_SOURCES, INITIAL_SYNC_LOGS, CODE_TEMPLATES } from '../services/automationSimulator';
import {
  Play,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Server,
  Database,
  Terminal,
  FileCode,
  AlertTriangle,
  Globe,
  Radio,
} from 'lucide-react';

interface AutomationDashboardProps {
  onChapterAdded: (mangaId: string, newChapterNumber: string) => void;
}

export const AutomationDashboard: React.FC<AutomationDashboardProps> = ({
  onChapterAdded,
}) => {
  const [sources, setSources] = useState<SyncSource[]>(DEFAULT_SYNC_SOURCES);
  const [logs, setLogs] = useState<SyncLogEntry[]>(INITIAL_SYNC_LOGS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'nodejs' | 'github' | 'vercel' | 'sql'>('nodejs');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTriggerManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Log 1: Start
    const startLog: SyncLogEntry = {
      id: `log-${Date.now()}-1`,
      timestamp: `${now.toISOString().split('T')[0]} ${timeStr}`,
      level: 'info',
      source: 'MangaDex API',
      message: 'მექანიკური სინქრონიზაცია დაიწყო: წყაროების გამოკითხვა (Querying MangaDex v5 & RSS)...',
    };
    setLogs((prev) => [startLog, ...prev]);

    // Step 2 after 900ms
    setTimeout(() => {
      const step2: SyncLogEntry = {
        id: `log-${Date.now()}-2`,
        timestamp: `${now.toISOString().split('T')[0]} ${timeStr}`,
        level: 'info',
        source: 'Pipeline Engine',
        message: 'შემოწმდა 38 ტრეკირებადი მანგა. ნაპოვნია 1 ახალი თავი: "Shadow Sovereign" (Ch. 183)!',
        mangaTitle: 'Shadow Sovereign: Monarch Rise',
      };
      setLogs((prev) => [step2, ...prev]);
    }, 900);

    // Step 3 after 1800ms: Save & complete
    setTimeout(() => {
      const step3: SyncLogEntry = {
        id: `log-${Date.now()}-3`,
        timestamp: `${now.toISOString().split('T')[0]} ${timeStr}`,
        level: 'success',
        source: 'Supabase DB',
        message: 'თავი 183 წარმატებით ჩაიწერა ბაზაში, გენერირდა CDN URL-ები და განახლდა კატალოგი.',
        mangaTitle: 'Shadow Sovereign: Monarch Rise',
        chaptersAdded: 1,
      };
      setLogs((prev) => [step3, ...prev]);
      setIsSyncing(false);

      // Trigger app callback to add Chapter 183 to live state
      onChapterAdded('manga-solo-monarch', '183');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Status bar */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-xs tracking-wider uppercase text-emerald-400">
                ავტომატიზაციის სისტემა აქტიურია
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ავტომატური თავების განახლების ძრავი (Cron & Sync)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
              სისტემა პერიოდულად ამოწმებს MangaDex-ის ოფიციალურ API-სა და RSS არხებს, ახდენს ახალი თავების დედუპლიკაციას და ავტომატურად ამატებს ბაზაში ადამიანის ჩარევის გარეშე.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerManualSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs text-white shadow-lg transition-all ${
                isSyncing
                  ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'მიმდინარეობს სინქრონიზაცია...' : 'სინქრონიზაციის გაშვება ახლავე'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
            <span className="text-[11px] font-medium text-neutral-400">შემოწმების ინტერვალი</span>
            <p className="text-base font-bold text-white font-mono mt-1">ყოველ 6 საათში</p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
            <span className="text-[11px] font-medium text-neutral-400">აქტიური წყაროები</span>
            <p className="text-base font-bold text-emerald-400 font-mono mt-1">3 წყარო (OK)</p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
            <span className="text-[11px] font-medium text-neutral-400">მონიტორინგის ქვეშ</span>
            <p className="text-base font-bold text-white font-mono mt-1">38 მანგა</p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
            <span className="text-[11px] font-medium text-neutral-400">წარმატებული სინქრონიზაცია</span>
            <p className="text-base font-bold text-rose-400 font-mono mt-1">99.8%</p>
          </div>
        </div>
      </div>

      {/* Sync Sources Table & Real-time Execution Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sources List */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" />
              ინტეგრირებული წყაროები (Data Sources)
            </h3>
            <span className="text-xs text-neutral-400">3 აქტიური</span>
          </div>

          <div className="space-y-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/60 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-neutral-100 truncate">
                      {src.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {src.type}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono truncate">{src.url}</p>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-2 pt-1">
                    <span>ბოლო შემოწმება: {src.lastSynced}</span>
                    <span aria-hidden="true">·</span>
                    <span>{src.mangasTracked} მანგა</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    აქტიური
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Execution Logs Terminal */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              სინქრონიზაციის ჟურნალი (Live Logs)
            </h3>
            <span className="text-xs font-mono text-neutral-400">Realtime</span>
          </div>

          <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto rounded-xl bg-black p-4 font-mono text-xs space-y-2 border border-neutral-800/80">
            {logs.map((log) => (
              <div key={log.id} className="leading-relaxed">
                <span className="text-neutral-500">[{log.timestamp}]</span>{' '}
                <span
                  className={
                    log.level === 'success'
                      ? 'text-emerald-400'
                      : log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'error'
                      ? 'text-rose-400'
                      : 'text-indigo-300'
                  }
                >
                  [{log.source}]
                </span>{' '}
                <span className="text-neutral-200">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Templates Section (Copyable Node.js, GitHub Actions, Vercel Cron, SQL) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <FileCode className="w-5 h-5 text-rose-400" />
              საწყისი კოდის სტრუქტურა და სკრიპტები (Code Templates)
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              მზა კოდი, რომელიც შეგიძლიათ გამოიყენოთ თქვენს რეპოზიტორიაში ავტომატური სინქრონიზაციისთვის.
            </p>
          </div>

          {/* Code Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveCodeTab('nodejs')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeCodeTab === 'nodejs' ? 'bg-rose-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Node.js Cron Script
            </button>
            <button
              onClick={() => setActiveCodeTab('github')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeCodeTab === 'github' ? 'bg-rose-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              GitHub Actions
            </button>
            <button
              onClick={() => setActiveCodeTab('vercel')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeCodeTab === 'vercel' ? 'bg-rose-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Vercel Cron
            </button>
            <button
              onClick={() => setActiveCodeTab('sql')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeCodeTab === 'sql' ? 'bg-rose-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Database Schema (SQL)
            </button>
          </div>
        </div>

        {/* Code Display Area */}
        <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/80 border-b border-neutral-800">
            <span className="text-xs font-mono text-neutral-400">
              {activeCodeTab === 'nodejs'
                ? 'scripts/auto-manga-sync.js'
                : activeCodeTab === 'github'
                ? '.github/workflows/manga-sync.yml'
                : activeCodeTab === 'vercel'
                ? 'vercel.json & api/cron/sync-manga.ts'
                : 'supabase/schema.sql'}
            </span>
            <button
              onClick={() =>
                handleCopy(
                  activeCodeTab,
                  activeCodeTab === 'nodejs'
                    ? CODE_TEMPLATES.nodejsCron
                    : activeCodeTab === 'github'
                    ? CODE_TEMPLATES.githubActions
                    : activeCodeTab === 'vercel'
                    ? CODE_TEMPLATES.vercelCron
                    : CODE_TEMPLATES.sqlSchema
                )
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors"
            >
              {copiedKey === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">დაკოპირდა</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>კოპირება</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed max-h-96">
            <code>
              {activeCodeTab === 'nodejs' && CODE_TEMPLATES.nodejsCron}
              {activeCodeTab === 'github' && CODE_TEMPLATES.githubActions}
              {activeCodeTab === 'vercel' && CODE_TEMPLATES.vercelCron}
              {activeCodeTab === 'sql' && CODE_TEMPLATES.sqlSchema}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
