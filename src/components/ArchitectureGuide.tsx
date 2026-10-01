import React from 'react';
import {
  Server,
  Cloud,
  Clock,
  Database,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  GitBranch,
  Layers,
  Zap,
  Globe,
  HardDrive,
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
        <span className="font-semibold text-xs tracking-wider uppercase text-rose-400">
          ტექნიკური არქიტექტურის გზამკვლევი
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
          როგორ ავაწყოთ სრულად ავტომატური მანგის საიტი კომპიუტერის ჩართვის გარეშე
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
          დეტალური პასუხი თქვენს შეკითხვაზე: რა არქიტექტურა ჯობია გამოვიყენოთ, როგორ დავაყენოთ ყოველდღიური სკრიპტები უფასოდ Vercel-ზე ან GitHub Actions-ზე და როგორ იმუშაოს სისტემამ 100%-ით დამოუკიდებლად.
        </p>
      </div>

      {/* Recommended 3-Tier Architecture Diagram */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          რეკომენდებული საუკეთესო არქიტექტურა (Serverless Trio)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Frontend */}
          <div className="p-5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <Globe className="w-4 h-4" />
              <span>1. Frontend (სამომხმარებლო საიტი)</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong>Vercel ან Cloudflare Pages</strong>-ზე განთავსებული React / Next.js აპლიკაცია.
            </p>
            <div className="text-[11px] text-neutral-400 space-y-1">
              <div>• ულტრასწრაფი Global Edge CDN</div>
              <div>• მობილურზე სრულად მორგებული Reader</div>
              <div>• 0 ლარი/თვეში (უფასო გეგმა)</div>
            </div>
          </div>

          {/* Card 2: Database */}
          <div className="p-5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Database className="w-4 h-4" />
              <span>2. Database (მონაცემთა ბაზა)</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong>Supabase (PostgreSQL)</strong> ან <strong>Firebase Firestore</strong>.
            </p>
            <div className="text-[11px] text-neutral-400 space-y-1">
              <div>• ინახავს მანგების სიას, თავებს, ლინკებს</div>
              <div>• მომხმარებლების სანიშნეებსა და ისტორიას</div>
              <div>• უფასო 500MB მონაცემთა ბაზა (საკმარისია 100,000+ თავისთვის)</div>
            </div>
          </div>

          {/* Card 3: Automation Cron */}
          <div className="p-5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Clock className="w-4 h-4" />
              <span>3. Automation Cron (ავტომატიზატორი)</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong>GitHub Actions</strong> (ან Vercel Cron).
            </p>
            <div className="text-[11px] text-neutral-400 space-y-1">
              <div>• ეშვება ყოველ 6 ან 12 საათში ავტომატურად</div>
              <div>• თქვენი კომპიუტერის ჩართვა არ სჭირდება</div>
              <div>• 2,000 უფასო წუთი თვეში GitHub-ზე</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: GitHub Actions vs Vercel Cron */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          რომელი სჯობს სკრიპტების გასაშვებად: GitHub Actions თუ Vercel Cron?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-100">GitHub Actions (რეკომენდებული)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">№1 არჩევანი</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              • <strong>დროის ლიმიტი:</strong> თითოეულ სკრიპტს შეუძლია იმუშაოს 6 საათამდე (Vercel-ზე კი სერვერლეს ფუნქციას 10-60 წამი აქვს ლიმიტი).
            </p>
            <p className="text-neutral-300 leading-relaxed">
              • <strong>ინტერვალი:</strong> შეგიძლიათ გაუშვათ ნებისმიერი სიხშირით (მაგ. ყოველ 4 საათში).
            </p>
            <p className="text-neutral-300 leading-relaxed">
              • <strong>Puppeteer / Scraper:</strong> შეუძლია გაუშვას სრული ბრაუზერიც კი, თუ რთული საიტის გაპარსვა დაგჭირდათ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-100">Vercel Cron Jobs</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium">სწრაფი API-სთვის</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              • <strong>უფასო ლიმიტი:</strong> უფასო (Hobby) გეგმაზე დაშვებულია მხოლოდ 1 Cron დღეში (მაგ. ყოველ დილის 04:00 საათზე).
            </p>
            <p className="text-neutral-300 leading-relaxed">
              • <strong>დროის შეზღუდვა:</strong> სერვერლეს ფუნქცია ითიშება 10 წამში, ამიტომ დიდი რაოდენობით მანგის ერთდროულად ჩაწერა რთულია.
            </p>
            <p className="text-neutral-300 leading-relaxed">
              • კარგია, თუ მხოლოდ მსუბუქი API მოთხოვნის გაგზავნა გსურთ.
            </p>
          </div>
        </div>
      </div>

      {/* Image Hosting Strategy & Hotlinking */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-rose-400" />
          სად შევინახოთ მანგის სურათები? (კრიტიკული ნაწილი)
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          ერთი მანგის თავი საშუალოდ 20-40MB-ია. 1,000 თავი უკვე 30-40 გიგაბაიტია. ამიტომ სურათების ფაილების შენახვა პირდაპირ Vercel-ზე ან თქვენს სერვერზე <strong>დაუშვებელია</strong> (Vercel-ს აქვს 100MB ლიმიტი).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <span className="font-semibold text-rose-400">მიდგომა 1: Direct CDN URL (MangaDex At-Home)</span>
            <p className="text-neutral-300 leading-relaxed">
              ბაზაში ინახება მხოლოდ სურათის ლინკები (URLs), ხოლო მკითხველი სურათებს იღებს უშუალოდ ოფიციალური CDN სერვერებიდან. თქვენს ბაზაში თითო თავს სჭირდება მხოლოდ რამდენიმე კილობაიტი ტექსტი!
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
            <span className="font-semibold text-indigo-400">მიდგომა 2: Cloudflare R2 / Backblaze B2</span>
            <p className="text-neutral-300 leading-relaxed">
              თუ გსურთ საკუთარ სერვერზე გქონდეთ სარეზერვო ასლი, გამოიყენეთ <strong>Cloudflare R2</strong> - პირველი 10GB სრულიად უფასოა და ტრაფიკზე (Bandwidth Egress) გადასახადი არის 0$.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Action Plan */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          პირველი ნაბიჯები პროექტის დასაწყებად:
        </h3>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">1</span>
            <div>
              <strong className="text-white">შექმენით უფასო Supabase პროექტი:</strong>
              <p className="text-neutral-400 text-xs mt-0.5">
                გადადით supabase.com-ზე, შექმენით ახალი პროექტი და გაუშვით ჩვენი SQL Schema (იხილეთ "ავტომატიზაცია" ტაბში).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">2</span>
            <div>
              <strong className="text-white">მოათავსეთ Node.js სკრიპტი თქვენს GitHub რეპოზიტორიაში:</strong>
              <p className="text-neutral-400 text-xs mt-0.5">
                შექმენით ფაილი <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded font-mono">scripts/auto-manga-sync.js</code> და <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded font-mono">.github/workflows/manga-sync.yml</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">3</span>
            <div>
              <strong className="text-white">დაამატეთ საიდუმლო გასაღებები GitHub Secrets-ში:</strong>
              <p className="text-neutral-400 text-xs mt-0.5">
                GitHub Repo Settings → Secrets-ში ჩაწერეთ <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded font-mono">SUPABASE_URL</code> და <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded font-mono">SUPABASE_SERVICE_ROLE_KEY</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">4</span>
            <div>
              <strong className="text-white">დააკავშირეთ Vercel თქვენს GitHub რეპოსთან:</strong>
              <p className="text-neutral-400 text-xs mt-0.5">
                Vercel ავტომატურად ააწყობს და გაუშვებს საიტს. ყოველ ჯერზე, როდესაც GitHub Actions იპოვის ახალ თავს, საიტზე ის მომენტალურად გამოჩნდება!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
