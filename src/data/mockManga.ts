import { Manga } from '../types/manga';
import coverSolo from '../assets/images/manga_cover_sololeveling_1790869326434.jpg';
import coverOnePiece from '../assets/images/manga_cover_onepiece_1790937965352.jpg';
import coverJujutsu from '../assets/images/manga_cover_jujutsu_1790937977023.jpg';
import coverBerserk from '../assets/images/manga_cover_fantasy_1790869315124.jpg';
import coverChainsaw from '../assets/images/manga_cover_cyberpunk_1790869301932.jpg';
import sampleMangaPage from '../assets/images/manga_reader_page_action_1790869337160.jpg';

// Helper to create realistic sample manga pages with action panels and Georgian/English text
const generateSamplePages = (chapterNum: string, title: string, count: number = 8): string[] => {
  return Array.from({ length: count }, (_, i) => {
    if (i === 0) return sampleMangaPage;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1350" viewBox="0 0 900 1350">
        <defs>
          <linearGradient id="panelGrad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f1012"/>
            <stop offset="100%" stop-color="#1c1d22"/>
          </linearGradient>
          <pattern id="screentone${i}" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#52525b" />
          </pattern>
        </defs>
        <rect width="900" height="1350" fill="#f8fafc"/>
        
        <!-- Outer Margins -->
        <rect x="40" y="40" width="820" height="1270" fill="none" stroke="#18181b" stroke-width="5"/>
        
        <!-- Header Info -->
        <text x="50" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#475569">${title} · თავი ${chapterNum}</text>
        <text x="850" y="30" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#475569">გვერდი ${i + 1} / ${count}</text>

        <!-- Top Action Panel -->
        <rect x="50" y="50" width="800" height="420" fill="url(#panelGrad${i})" stroke="#09090b" stroke-width="4"/>
        <rect x="50" y="50" width="800" height="420" fill="url(#screentone${i})" opacity="0.3"/>
        
        <!-- Dynamic speed lines -->
        <line x1="50" y1="50" x2="450" y2="260" stroke="#fff" stroke-width="2" opacity="0.35"/>
        <line x1="850" y1="50" x2="450" y2="260" stroke="#fff" stroke-width="2" opacity="0.35"/>
        <line x1="50" y1="470" x2="450" y2="260" stroke="#fff" stroke-width="2" opacity="0.35"/>
        <line x1="850" y1="470" x2="450" y2="260" stroke="#fff" stroke-width="2" opacity="0.35"/>
        
        <text x="450" y="240" text-anchor="middle" font-family="'Syne', 'Impact', sans-serif" font-weight="900" font-size="68" fill="#ffffff" stroke="#000" stroke-width="3" transform="rotate(-4 450 240)">KRAAAASH!</text>
        <text x="450" y="300" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="16" fill="#f87171">ენერგიის კონცენტრაციამ კრიტიკულ ზღვარს მიაღწია!</text>

        <!-- Speech Bubble in Top Panel -->
        <path d="M 600,100 Q 620,80 720,80 Q 820,80 820,150 Q 820,210 720,210 L 690,250 L 680,210 Q 600,210 600,150 Z" fill="#ffffff" stroke="#111" stroke-width="3"/>
        <text x="710" y="140" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="bold" fill="#09090b">"გაჩერდი!"</text>
        <text x="710" y="165" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" fill="#334155">"ეს ძალა შენ გაგანადგურებს!"</text>

        <!-- Middle Dual Panels -->
        <!-- Left Panel -->
        <rect x="50" y="485" width="390" height="380" fill="#18181b" stroke="#09090b" stroke-width="4"/>
        <circle cx="245" cy="670" r="90" fill="#27272a"/>
        <path d="M 190,720 Q 245,610 300,720 Z" fill="#3f3f46"/>
        <text x="245" y="580" text-anchor="middle" font-family="'Syne', sans-serif" font-weight="800" font-size="24" fill="#fb7185">⚡ FZZZZT ⚡</text>
        <text x="245" y="780" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#cbd5e1">"გამოღვიძების დროა..."</text>

        <!-- Right Panel -->
        <rect x="460" y="485" width="390" height="380" fill="#09090b" stroke="#09090b" stroke-width="4"/>
        <path d="M 470,495 L 840,855 M 840,495 L 470,855" stroke="#e11d48" stroke-width="3" opacity="0.6"/>
        <polygon points="560,540 760,540 790,660 530,660" fill="#ffffff" stroke="#111" stroke-width="3"/>
        <text x="660" y="605" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="bold" fill="#0f172a">"არასდროს დავნებდები!"</text>

        <!-- Bottom Wide Panel -->
        <rect x="50" y="880" width="800" height="420" fill="#111215" stroke="#09090b" stroke-width="4"/>
        <rect x="50" y="880" width="800" height="420" fill="url(#screentone${i})" opacity="0.25"/>
        <polygon points="50,1300 450,1000 850,1300" fill="#27272a" opacity="0.7"/>
        <text x="450" y="1120" text-anchor="middle" font-family="'Syne', sans-serif" font-size="52" font-weight="900" fill="#facc15" stroke="#000" stroke-width="3">SHHHHIKK!</text>
        <text x="450" y="1325" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" fill="#94a3b8">[ MangaPulse · თავი ${chapterNum} · გვერდი ${i + 1} / ${count} ]</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });
};

export const INITIAL_MANGAS: Manga[] = [
  {
    id: 'manga-solo-leveling',
    title: 'Solo Leveling',
    altTitle: 'სოლო ლეველინგი (나 혼자만 레벨업)',
    author: 'Chugong & DUBU (Redice Studio)',
    artist: 'DUBU (Redice Studio)',
    coverImage: coverSolo,
    description: '10 წლის წინ, როდესაც რეალურ სამყაროში გაიხსნა იდუმალი "კარიბჭეები" და მონსტრები გამოჩნდნენ, ზოგიერთმა ადამიანმა მიიღო ზებუნებრივი შესაძლებლობები და მათ "მონადირეები" ეწოდათ. სუნ ჯინ-ვუ ცნობილი იყო როგორც "კაცობრიობის ყველაზე სუსტი E-რანგის მონადირე", სანამ ორმაგ დილეგში სიკვდილის პირას არ გაიღვიძა და არ მიიღო უნიკალური Quest სისტემა, რომელიც მხოლოდ მას აძლევს უსასრულო გაძლიერების ძალას.',
    status: 'Completed',
    genres: ['Action', 'Fantasy', 'Supernatural', 'Shonen'],
    rating: 4.96,
    views: 1250000,
    latestChapter: 'Ch. 200 (Epilogue)',
    updatedAt: '2026-10-02 03:00',
    isFeatured: true,
    chapters: [
      {
        id: 'sl-200',
        chapterNumber: '200',
        title: 'The Monarch of Shadows: Epilogue',
        releaseDate: '2026-10-01',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('200', 'Solo Leveling', 8),
      },
      {
        id: 'sl-199',
        chapterNumber: '199',
        title: 'Peace of the World',
        releaseDate: '2026-09-24',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('199', 'Solo Leveling', 8),
      },
      {
        id: 'sl-198',
        chapterNumber: '198',
        title: 'Dimensional Rupture',
        releaseDate: '2026-09-17',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('198', 'Solo Leveling', 8),
      },
      {
        id: 'sl-1',
        chapterNumber: '1',
        title: 'The Weakest Hunter E-Rank',
        releaseDate: '2026-01-01',
        scanlationGroup: 'Asura Scans',
        pageCount: 8,
        pages: generateSamplePages('1', 'Solo Leveling', 8),
      },
    ],
  },
  {
    id: 'manga-one-piece',
    title: 'One Piece',
    altTitle: 'ვან პისი (ワンピース)',
    author: 'Eiichiro Oda (ეიიჩირო ოდა)',
    artist: 'Eiichiro Oda',
    coverImage: coverOnePiece,
    description: 'მეკობრეების ოქროს ხანა დაიწყო მაშინ, როდესაც მეკობრეთა მეფემ, გოლ დ. როჯერმა, სიკვდილით დასჯამდე მსოფლიოს გამოუცხადა თავისი ლეგენდარული საგანძურის - "ვან პისის" არსებობის შესახებ. მონკი დ. ლუფი, ბიჭი რომელმაც ეშმაკის ნაყოფი შეჭამა და სხეული რეზინად ექცა, ოცნებობს იპოვოს ეს საგანძური და გახდეს მეკობრეთა ახალი მეფე.',
    status: 'Ongoing',
    genres: ['Adventure', 'Action', 'Comedy', 'Fantasy', 'Shonen'],
    rating: 4.98,
    views: 3400000,
    latestChapter: 'Ch. 1128',
    updatedAt: '2026-10-01 18:20',
    isFeatured: true,
    chapters: [
      {
        id: 'op-1128',
        chapterNumber: '1128',
        title: 'RPG of the Sun God',
        releaseDate: '2026-10-01',
        scanlationGroup: 'TCB Scans',
        pageCount: 8,
        pages: generateSamplePages('1128', 'One Piece', 8),
      },
      {
        id: 'op-1127',
        chapterNumber: '1127',
        title: 'Adventure in the Mysterious Kingdom',
        releaseDate: '2026-09-22',
        scanlationGroup: 'TCB Scans',
        pageCount: 8,
        pages: generateSamplePages('1127', 'One Piece', 8),
      },
      {
        id: 'op-1126',
        chapterNumber: '1126',
        title: 'Payback',
        releaseDate: '2026-09-15',
        scanlationGroup: 'TCB Scans',
        pageCount: 8,
        pages: generateSamplePages('1126', 'One Piece', 8),
      },
      {
        id: 'op-1',
        chapterNumber: '1',
        title: 'Romance Dawn',
        releaseDate: '1997-07-22',
        scanlationGroup: 'TCB Scans',
        pageCount: 8,
        pages: generateSamplePages('1', 'One Piece', 8),
      },
    ],
  },
  {
    id: 'manga-jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    altTitle: 'ჯუჯუცუ კაისენი (呪術廻戦)',
    author: 'Gege Akutami (გეგე აკუტამი)',
    artist: 'Gege Akutami',
    coverImage: coverJujutsu,
    description: 'იუჯი იტადორი არაჩვეულებრივი ფიზიკური შესაძლებლობების მქონე საშუალო სკოლის მოსწავლეა. მეგობრების გადასარჩენად ის გადაყლაპავს რიომენ სუკუნას - წყევლათა უძლიერესი მეფის თითს. შედეგად ის ეხვევა წყევლის შამანების საშიშ და დაუნდობელ სამყაროში, სადაც საკაცობრიო უარყოფითი ემოციები მომაკვდინებელ ურჩხულებად ცოცხლდებიან.',
    status: 'Completed',
    genres: ['Action', 'Supernatural', 'Dark Fantasy', 'Shonen'],
    rating: 4.93,
    views: 2150000,
    latestChapter: 'Ch. 271 (Finale)',
    updatedAt: '2026-09-30 20:00',
    isFeatured: true,
    chapters: [
      {
        id: 'jjk-271',
        chapterNumber: '271',
        title: 'From Here On (Finale)',
        releaseDate: '2026-09-30',
        scanlationGroup: 'Shishiso Scans',
        pageCount: 8,
        pages: generateSamplePages('271', 'Jujutsu Kaisen', 8),
      },
      {
        id: 'jjk-270',
        chapterNumber: '270',
        title: 'The Dream\'s End',
        releaseDate: '2026-09-22',
        scanlationGroup: 'Shishiso Scans',
        pageCount: 8,
        pages: generateSamplePages('270', 'Jujutsu Kaisen', 8),
      },
      {
        id: 'jjk-269',
        chapterNumber: '269',
        title: 'Reunion',
        releaseDate: '2026-09-15',
        scanlationGroup: 'Shishiso Scans',
        pageCount: 8,
        pages: generateSamplePages('269', 'Jujutsu Kaisen', 8),
      },
    ],
  },
  {
    id: 'manga-berserk',
    title: 'Berserk',
    altTitle: 'ბერსერკი (ベルセルク)',
    author: 'Kentaro Miura & Studio Gaga (კენტარო მიურა)',
    artist: 'Studio Gaga',
    coverImage: coverBerserk,
    description: 'გატსი - "შავი ხმლისმტვირთავი", დაუნდობელი და მარტოხელა მეომარია უზარმაზარი ხმლით "Dragon Slayer". ბავშვობიდან სისხლსა და ომში გაზრდილი, ის უერთდება გრიფიტის "შავარდენის რაზმს". თუმცა საბედისწერო დაბნელების შემდეგ, როდესაც მეგობრობა უდიდეს ღალატად იქცა, გატსი იწყებს უსასრულო შურისძიებას დემონებისა და ბედისწერის წინააღმდეგ.',
    status: 'Ongoing',
    genres: ['Dark Fantasy', 'Action', 'Seinen', 'Horror'],
    rating: 4.99,
    views: 1850000,
    latestChapter: 'Ch. 376',
    updatedAt: '2026-09-28 14:40',
    chapters: [
      {
        id: 'ber-376',
        chapterNumber: '376',
        title: 'The Eastern Exile',
        releaseDate: '2026-09-28',
        scanlationGroup: 'Evil Genius',
        pageCount: 8,
        pages: generateSamplePages('376', 'Berserk', 8),
      },
      {
        id: 'ber-375',
        chapterNumber: '375',
        title: 'Descent into Fog',
        releaseDate: '2026-08-10',
        scanlationGroup: 'Evil Genius',
        pageCount: 8,
        pages: generateSamplePages('375', 'Berserk', 8),
      },
    ],
  },
  {
    id: 'manga-chainsaw-man',
    title: 'Chainsaw Man',
    altTitle: 'ბენზოხერხა ადამიანი (チェンソーマン)',
    author: 'Tatsuki Fujimoto (ტაცუკი ფუჯიმოტო)',
    artist: 'Tatsuki Fujimoto',
    coverImage: coverChainsaw,
    description: 'დენჯი ახალგაზრდა ბიჭია, რომელიც მამის უზარმაზარი ვალების გადასახდელად იაკუძასთვის დემონებზე ნადირობს თავის პატარა ეშმაკ-ძაღლ პოჩიტასთან ერთად. ღალატისა და სიკვდილის შემდეგ პოჩიტა ხდება დენჯის გული და მას აქცევს "ბენზოხერხა ადამიანად" - არსებად, რომელსაც სხეულიდან ნამდვილი ბენზოხერხების გამოშვება შეუძლია.',
    status: 'Ongoing',
    genres: ['Action', 'Dark Fantasy', 'Supernatural', 'Psychological'],
    rating: 4.91,
    views: 1980000,
    latestChapter: 'Ch. 178',
    updatedAt: '2026-10-01 10:15',
    chapters: [
      {
        id: 'csm-178',
        chapterNumber: '178',
        title: 'The Aging Devil',
        releaseDate: '2026-10-01',
        scanlationGroup: 'MangaPlus',
        pageCount: 8,
        pages: generateSamplePages('178', 'Chainsaw Man', 8),
      },
      {
        id: 'csm-177',
        chapterNumber: '177',
        title: 'Fingers Crossed',
        releaseDate: '2026-09-24',
        scanlationGroup: 'MangaPlus',
        pageCount: 8,
        pages: generateSamplePages('177', 'Chainsaw Man', 8),
      },
    ],
  },
  {
    id: 'manga-attack-on-titan',
    title: 'Attack on Titan',
    altTitle: 'ტიტანებზე შეტევა (進撃の巨人)',
    author: 'Hajime Isayama (ჰაჯიმე ისაიამა)',
    artist: 'Hajime Isayama',
    coverImage: coverBerserk,
    description: 'ასზე მეტი წლის განმავლობაში კაცობრიობა ცხოვრობდა სამი გიგანტური კედლის მიღმა, რათა თავი დაეცვა კაციჭამია გიგანტებისგან - ტიტანებისგან. თუმცა კოლოსალური ტიტანის მიერ კედლის გარღვევის შემდეგ, ახალგაზრდა ერენ იეგერი უყურებს დედის სიკვდილს და დებს ფიცს, რომ მსოფლიოს პირისაგან აღგვის უკანასკნელ ტიტანსაც კი.',
    status: 'Completed',
    genres: ['Action', 'Mystery', 'Drama', 'Fantasy'],
    rating: 4.94,
    views: 2900000,
    latestChapter: 'Ch. 139 (Finale)',
    updatedAt: '2026-09-18 12:00',
    chapters: [
      {
        id: 'aot-139',
        chapterNumber: '139',
        title: 'Toward the Tree on That Hill (Finale)',
        releaseDate: '2021-04-09',
        scanlationGroup: 'Kodansha Comics',
        pageCount: 8,
        pages: generateSamplePages('139', 'Attack on Titan', 8),
      },
    ],
  },
  {
    id: 'manga-demon-slayer',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    altTitle: 'დემონების გამანადგურებელი (鬼滅の刃)',
    author: 'Koyoharu Gotouge (კოიოჰარუ გოტოგე)',
    artist: 'Koyoharu Gotouge',
    coverImage: coverJujutsu,
    description: 'ტაიშოს ეპოქის იაპონიაში, ტანჯირო კამადო ნახშირით მოვაჭრე კეთილი ბიჭია, რომლის ოჯახიც დემონმა სასტიკად ამოხოცა. გადარჩა მხოლოდ მისი უმცროსი და ნეზუკო, თუმცა ისიც სისხლისმსმელ დემონად იქცა. ტანჯირო უერთდება დემონების გამანადგურებელთა კორპუსს, რათა იპოვოს წამალი დის ადამიანად დასაბრუნებლად.',
    status: 'Completed',
    genres: ['Action', 'Historical', 'Supernatural', 'Shonen'],
    rating: 4.89,
    views: 2400000,
    latestChapter: 'Ch. 205 (End)',
    updatedAt: '2026-09-10 16:30',
    chapters: [
      {
        id: 'ds-205',
        chapterNumber: '205',
        title: 'Life Shining Across the Generations',
        releaseDate: '2020-05-18',
        scanlationGroup: 'Viz Media',
        pageCount: 8,
        pages: generateSamplePages('205', 'Demon Slayer', 8),
      },
    ],
  },
];
