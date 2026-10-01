import { Manga } from '../types/manga';
import coverCyberpunk from '../assets/images/manga_cover_cyberpunk_1790869301932.jpg';
import coverFantasy from '../assets/images/manga_cover_fantasy_1790869315124.jpg';
import coverSolo from '../assets/images/manga_cover_sololeveling_1790869326434.jpg';
import sampleMangaPage from '../assets/images/manga_reader_page_action_1790869337160.jpg';

// Helper to create realistic sample manga pages
const generateSamplePages = (chapterNum: string, title: string, count: number = 8): string[] => {
  return Array.from({ length: count }, (_, i) => {
    // If it's page 1, use the detailed manga page artwork
    if (i === 0) return sampleMangaPage;
    // For other pages, we provide stylized high-res manga panel SVG data URIs
    // with action panels, dialogues, and sound effects to simulate real manga pages
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1350" viewBox="0 0 900 1350">
        <defs>
          <linearGradient id="panelGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#121214"/>
            <stop offset="100%" stop-color="#1e1e24"/>
          </linearGradient>
          <pattern id="screentone${i}" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.75" fill="#4a4d57" />
          </pattern>
        </defs>
        <rect width="900" height="1350" fill="#f8f9fa"/>
        
        <!-- Page border margins -->
        <rect x="40" y="40" width="820" height="1270" fill="none" stroke="#222" stroke-width="6"/>
        
        <!-- Header info -->
        <text x="50" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#666">${title} · Chapter ${chapterNum}</text>
        <text x="850" y="30" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#666">Page ${i + 1} / ${count}</text>

        <!-- Top Large Action Panel -->
        <rect x="50" y="50" width="800" height="380" fill="url(#panelGrad${i})" stroke="#111" stroke-width="4"/>
        <rect x="50" y="50" width="800" height="380" fill="url(#screentone${i})" opacity="0.35"/>
        
        <!-- Speed lines / Action vectors in panel 1 -->
        <line x1="50" y1="50" x2="450" y2="240" stroke="#fff" stroke-width="2" opacity="0.4"/>
        <line x1="850" y1="50" x2="450" y2="240" stroke="#fff" stroke-width="2" opacity="0.4"/>
        <line x1="50" y1="430" x2="450" y2="240" stroke="#fff" stroke-width="2" opacity="0.4"/>
        <line x1="850" y1="430" x2="450" y2="240" stroke="#fff" stroke-width="2" opacity="0.4"/>
        
        <!-- Sound Effect Onomatopoeia -->
        <text x="450" y="220" text-anchor="middle" font-family="'Syne', 'Impact', sans-serif" font-weight="900" font-size="64" fill="#ffffff" stroke="#000" stroke-width="4" transform="rotate(-6 450 220)">DOOOM!</text>
        <text x="450" y="270" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="#e2e8f0">The energy vortex ruptured the dimensional barrier...</text>

        <!-- Speech bubble in Panel 1 -->
        <path d="M 620,100 Q 640,80 720,80 Q 800,80 800,140 Q 800,200 710,200 L 680,240 L 670,200 Q 620,200 620,140 Z" fill="#ffffff" stroke="#111" stroke-width="3"/>
        <text x="710" y="130" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#111">"Stay back!"</text>
        <text x="710" y="152" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#333">"It awakens!"</text>

        <!-- Middle Split Panels -->
        <!-- Panel 2 Left -->
        <rect x="50" y="445" width="390" height="390" fill="#18181b" stroke="#111" stroke-width="4"/>
        <!-- Silhouette art in panel 2 -->
        <circle cx="245" cy="620" r="90" fill="#27272a"/>
        <path d="M 200,680 Q 245,580 290,680 Z" fill="#3f3f46"/>
        <text x="245" y="550" text-anchor="middle" font-family="'Syne', sans-serif" font-weight="700" font-size="20" fill="#f43f5e">⚡ SHIKK ⚡</text>
        <text x="245" y="730" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#a1a1aa">Target acquired</text>

        <!-- Panel 3 Right -->
        <rect x="460" y="445" width="390" height="390" fill="#09090b" stroke="#111" stroke-width="4"/>
        <path d="M 470,455 L 840,825 M 840,455 L 470,825" stroke="#ef4444" stroke-width="3" opacity="0.6"/>
        <path d="M 500,520 Q 580,480 660,520 Q 720,560 670,620 L 640,660 L 630,620 Q 500,620 500,520 Z" fill="#fff" stroke="#111" stroke-width="3"/>
        <text x="600" y="555" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#000">"Not on my watch!"</text>

        <!-- Bottom Wide Panel -->
        <rect x="50" y="850" width="800" height="450" fill="#121214" stroke="#111" stroke-width="4"/>
        <rect x="50" y="850" width="800" height="450" fill="url(#screentone${i})" opacity="0.25"/>
        
        <!-- Bottom dramatic perspective lines -->
        <polygon points="50,1300 450,960 850,1300" fill="#222" opacity="0.8"/>
        <text x="450" y="1060" text-anchor="middle" font-family="'Syne', sans-serif" font-size="42" font-weight="800" fill="#facc15" stroke="#000" stroke-width="2">BOOOOOM!</text>
        
        <path d="M 120,1100 Q 140,1050 280,1050 Q 400,1050 400,1130 Q 400,1210 260,1210 L 220,1250 L 230,1210 Q 120,1210 120,1130 Z" fill="#fff" stroke="#111" stroke-width="3"/>
        <text x="260" y="1120" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#000">"The core frequency has synchronized!"</text>
        <text x="260" y="1145" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#333">"Initiate phase sequence now!"</text>
        
        <text x="450" y="1335" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#71717a">[ MangaPulse Reader · Page ${i + 1} of ${count} ]</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });
};

export const INITIAL_MANGAS: Manga[] = [
  {
    id: 'manga-solo-monarch',
    title: 'Shadow Sovereign: Monarch Rise',
    altTitle: 'სოლო მონარქი: ჩრდილის აღზევება',
    author: 'Chugong & DUBU Studio',
    artist: 'Redice Studio',
    coverImage: coverSolo,
    description: '10 წლის წინ, როდესაც "კარიბჭეები" გაიხსნა და რეალური სამყარო ურჩხულებით სავსე დილეგებს შეუერთდა, ზოგიერთმა ადამიანმა ზებუნებრივი ძალები მიიღო. სუნ ჯინ-ვუ ცნობილი იყო როგორც "კაცობრიობის ყველაზე სუსტი E-რანგის მონადირე", სანამ ორმაგ დილეგში სასიკვდილო განსაცდელის შემდეგ იდუმალ Quest სისტემას არ გააღვიძებდა...',
    status: 'Ongoing',
    genres: ['Action', 'Fantasy', 'Supernatural', 'Shonen'],
    rating: 4.95,
    views: 489200,
    latestChapter: 'Ch. 182',
    updatedAt: '2026-10-01 06:30',
    isFeatured: true,
    chapters: [
      {
        id: 'solo-182',
        chapterNumber: '182',
        title: 'The Sovereign War Begins',
        releaseDate: '2026-10-01',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('182', 'Shadow Sovereign', 8),
      },
      {
        id: 'solo-181',
        chapterNumber: '181',
        title: 'Call of the Shadow Monarch',
        releaseDate: '2026-09-24',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('181', 'Shadow Sovereign', 8),
      },
      {
        id: 'solo-180',
        chapterNumber: '180',
        title: 'Convergence of Hunters',
        releaseDate: '2026-09-17',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('180', 'Shadow Sovereign', 8),
      },
      {
        id: 'solo-179',
        chapterNumber: '179',
        title: 'The Gate of Chaos',
        releaseDate: '2026-09-10',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('179', 'Shadow Sovereign', 8),
      },
    ],
  },
  {
    id: 'manga-cyber-blade',
    title: 'Cyber Blade: Neo Tokyo 2088',
    altTitle: 'კიბერ ხმალი: ნეო ტოკიო',
    author: 'Katsura Kenji',
    artist: 'Miyazaki Rui',
    coverImage: coverCyberpunk,
    description: 'ნეო ტოკიოს ნეონით განათებულ ქუჩებში, სადაც მეგა-კორპორაციები სულებსაც კი ყიდიან, რინაკო - კიბერნეტიკულად გაძლიერებული რონინი - იწყებს ბრძოლას თავისი დის გასათავისუფლებლად. ხელში მხოლოდ მონომოლეკულური კატანა და ძველი აპარატურა აქვს.',
    status: 'Ongoing',
    genres: ['Sci-Fi', 'Action', 'Seinen', 'Cyberpunk'],
    rating: 4.88,
    views: 312400,
    latestChapter: 'Ch. 64',
    updatedAt: '2026-09-30 22:15',
    isFeatured: true,
    chapters: [
      {
        id: 'cyber-64',
        chapterNumber: '64',
        title: 'Neon Bloodshed',
        releaseDate: '2026-09-30',
        scanlationGroup: 'Flame Comics',
        pageCount: 7,
        pages: generateSamplePages('64', 'Cyber Blade', 7),
      },
      {
        id: 'cyber-63',
        chapterNumber: '63',
        title: 'Overclocked Neural Core',
        releaseDate: '2026-09-23',
        scanlationGroup: 'Flame Comics',
        pageCount: 7,
        pages: generateSamplePages('63', 'Cyber Blade', 7),
      },
      {
        id: 'cyber-62',
        chapterNumber: '62',
        title: 'Black Ice Protocol',
        releaseDate: '2026-09-16',
        scanlationGroup: 'Flame Comics',
        pageCount: 7,
        pages: generateSamplePages('62', 'Cyber Blade', 7),
      },
    ],
  },
  {
    id: 'manga-shadow-summoner',
    title: 'Rune of the Forgotten Ruin',
    altTitle: 'დავიწყებული ნანგრევების რუნა',
    author: 'Eldridge Vance',
    artist: 'Luna Solaris',
    coverImage: coverFantasy,
    description: 'ათასი წლის წინ დამარხული მაგიური ცივილიზაციის ნაშთები კვლავ იღვიძებს. ახალგაზრდა არქეოლოგი და ჩრდილის მაგი ელარიანი აღმოაჩენს აკრძალულ რუნულ წიგნს, რომელსაც შეუძლია უძველესი ტიტანების გამოძახება.',
    status: 'Ongoing',
    genres: ['Fantasy', 'Adventure', 'Mystery', 'Supernatural'],
    rating: 4.82,
    views: 265000,
    latestChapter: 'Ch. 41',
    updatedAt: '2026-09-29 18:40',
    isFeatured: true,
    chapters: [
      {
        id: 'rune-41',
        chapterNumber: '41',
        title: 'Whispers from the Abyss',
        releaseDate: '2026-09-29',
        scanlationGroup: 'Reaper Scans',
        pageCount: 6,
        pages: generateSamplePages('41', 'Rune of the Forgotten Ruin', 6),
      },
      {
        id: 'rune-40',
        chapterNumber: '40',
        title: 'Seal of the Seventh Archon',
        releaseDate: '2026-09-22',
        scanlationGroup: 'Reaper Scans',
        pageCount: 6,
        pages: generateSamplePages('40', 'Rune of the Forgotten Ruin', 6),
      },
    ],
  },
  {
    id: 'manga-infinite-mage',
    title: 'The Infinite Alchemist',
    altTitle: 'უსასრულო ალქიმიკოსი',
    author: 'Kim Daewon',
    artist: 'Studio Green',
    coverImage: coverFantasy,
    description: 'მიტოვებული ბავშვი თავლაში იზრდება, მაგრამ მისი გონება სამყაროს უსასრულო მათემატიკურ კანონებს ხედავს. მაგიის აკადემიაში შესვლისთანავე ის არღვევს ყველა დამკვიდრებულ წესს.',
    status: 'Ongoing',
    genres: ['Fantasy', 'Action', 'Shonen'],
    rating: 4.79,
    views: 198000,
    latestChapter: 'Ch. 98',
    updatedAt: '2026-09-28 14:10',
    chapters: [
      {
        id: 'inf-98',
        chapterNumber: '98',
        title: 'Formula of Light',
        releaseDate: '2026-09-28',
        scanlationGroup: 'Zero Scans',
        pageCount: 6,
        pages: generateSamplePages('98', 'The Infinite Alchemist', 6),
      },
      {
        id: 'inf-97',
        chapterNumber: '97',
        title: 'Calculus of Mana',
        releaseDate: '2026-09-21',
        scanlationGroup: 'Zero Scans',
        pageCount: 6,
        pages: generateSamplePages('97', 'The Infinite Alchemist', 6),
      },
    ],
  },
  {
    id: 'manga-reincarnated-assassin',
    title: 'The Heavenly Demon Can\'t Live a Normal Life',
    altTitle: 'ზეციური დემონი წყნარად ვერ იცხოვრებს',
    author: 'San Cheon',
    artist: 'Redice Studio',
    coverImage: coverSolo,
    description: 'მურიმის უძლიერესი ზეციური დემონი ბაეკ ჯუნ-ჰიუკი გარდაცვალების შემდეგ იბადება დასავლური ტიპის ფენტეზის სამყაროში, როგორც დიმიტრიის ბარონის უსარგებლო პირველი ვაჟი.',
    status: 'Ongoing',
    genres: ['Action', 'Fantasy', 'Martial Arts', 'Seinen'],
    rating: 4.91,
    views: 420000,
    latestChapter: 'Ch. 124',
    updatedAt: '2026-09-27 19:20',
    chapters: [
      {
        id: 'hd-124',
        chapterNumber: '124',
        title: 'Iron Blood of Dmitry',
        releaseDate: '2026-09-27',
        scanlationGroup: 'Asura Scans',
        pageCount: 6,
        pages: generateSamplePages('124', 'Heavenly Demon', 6),
      },
    ],
  },
  {
    id: 'manga-tokyo-ghoul-echoes',
    title: 'Echoes of the Ghoul Realm',
    altTitle: 'გულის სამეფოს ექოები',
    author: 'Ishida Sui Legacy',
    artist: 'Young Jump Art',
    coverImage: coverCyberpunk,
    description: 'ტოკიოს 24-ე რაიონში დაწყებული ახალი ექსპერიმენტები ადამიანისა და გულის ჰიბრიდებზე. ბრძოლა გადარჩენისთვის სიბნელეში.',
    status: 'Completed',
    genres: ['Horror', 'Supernatural', 'Action', 'Psychological'],
    rating: 4.85,
    views: 540000,
    latestChapter: 'Ch. 143 (End)',
    updatedAt: '2026-09-20 12:00',
    chapters: [
      {
        id: 'tge-143',
        chapterNumber: '143',
        title: 'The Final Rebirth (End)',
        releaseDate: '2026-09-20',
        scanlationGroup: 'MangaDex',
        pageCount: 8,
        pages: generateSamplePages('143', 'Echoes of the Ghoul Realm', 8),
      },
    ],
  },
];
