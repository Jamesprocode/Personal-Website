// Timeline data — three tracks: Academic, Internships, Music Performance.
// Each entry has both a short `displayTitle` for the chart (one line) and
// a longer `details` paragraph for the popup readout.

const timeline = [
  // ---------- Academic (blue) ----------
  {
    id: 1,
    year: 2025,
    category: 'Academic',
    title: 'M.S. Music Technology, Georgia Tech',
    displayTitle: 'Georgia Tech M.S.',
    iconKey: 'gt',
    logo: '/logos/gt.png',
    forceRow: 'below-near',
    details:
      'M.S. in Music Technology at Georgia Tech, August 2025 to present. Coursework and research across deep learning for music, audio software engineering, and music informatics.',
    color: 'blue',
  },
  {
    id: 2,
    year: 2024,
    category: 'Academic',
    title: 'Peer Tutor, Occidental Music Dept',
    displayTitle: 'Music Dept Tutor',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    forceRow: 'above-near',
    details:
      'Music Department Peer Tutor at Occidental, September 2024 to May 2025. Held office hours for 40 students on theory and production, and helped new music majors with advising and registration.',
    color: 'blue',
  },
  {
    id: 3,
    year: 2023,
    category: 'Academic',
    title: 'Studio Asst., Choi Recording Studio',
    displayTitle: 'Choi Studio',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    forceRow: 'below-near',
    details:
      'Studio Assistant at Occidental’s Choi Recording Studio, August 2023 to May 2025. Managed a $60K+ inventory of mics and outboard gear, supervised student sessions, and ran the Electronic Music Studio.',
    color: 'blue',
  },
  {
    id: 4,
    year: 2022,
    category: 'Academic',
    title: 'Production Manager Asst., Occidental Music Dept',
    displayTitle: 'Music Dept Assistant',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    forceRow: 'above-near',
    details:
      'Production Manager Assistant at the Occidental Music Department, January 2022 to May 2025. Ran event promo, logistics, and social for 15–20 performances per semester, plus live-stream / record set-up and equipment archive.',
    color: 'blue',
  },
  {
    id: 5,
    year: 2021,
    category: 'Academic',
    title: 'Research Asst., VIVO Lab',
    displayTitle: 'VIVO Lab',
    iconKey: 'research',
    logo: '/logos/oxy.png',
    forceRow: 'below-near',
    details:
      'Research Assistant under Dr. Fabio Paolizzo on VIVO (Video Interactive VST Orchestra). Built MAX/MSP components for real-time VST parameter prediction via Hidden Markov Models and sound-recognition integration. Funded by EU Horizon and Mellon Foundation grants.',
    color: 'blue',
  },
  {
    id: 6,
    year: 2020,
    category: 'Academic',
    title: 'B.A., Occidental College',
    displayTitle: 'Occidental College',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    forceRow: 'above-near',
    details:
      'Started at Occidental, August 2020. Double major in Music (Production emphasis) and Computer Science, minor in Mathematics. Graduated May 2025 — Magna Cum Laude, GPA 3.88, Dean’s List every semester, Kurtich Music Grant 2023–2025.',
    color: 'blue',
  },

  // ---------- Internships (gray) ----------
  {
    id: 22,
    year: 2026,
    category: 'Internships',
    title: 'Intern, Tencent Music Entertainment (Kugou Music)',
    displayTitle: 'TME · Kugou',
    iconKey: 'tech',
    logo: '/logos/kugou.png',
    details:
      'Intern at Tencent Music Entertainment’s Kugou Music in summer 2026. Worked on a guitar accompaniment and tablature generation system, including score processing, MusicXML and MuseScore output, batch validation, and an internal review portal.',
    color: 'gray',
  },
  {
    id: 7,
    year: 2024,
    category: 'Internships',
    title: 'Data Science Intern, Leizhi Information Tech',
    displayTitle: 'Leizhi Data Sci',
    iconKey: 'tech',
    details:
      'Data Science Intern at Leizhi Information Technology in Shanghai, July–August 2024. Clustering and density analysis of Pudong District high-risk merchants using K-means and KDE; temporal hotspot analysis on merchant complaints feeding a real-time monitoring system.',
    color: 'gray',
  },
  {
    id: 9,
    year: 2023,
    category: 'Internships',
    title: 'Recording Intern, Kingsize Soundlabs',
    displayTitle: 'Kingsize Soundlabs',
    iconKey: 'mic',
    logo: '/logos/kingsize.png',
    details:
      'Recording Intern at Kingsize Soundlabs in LA, spring 2023 (February–June). Shadowed engineers on sessions with Lyla Forde, Will Brahm, Walter Trout, Aidan Carroll, Julius Rodriguez, Drown, and Dudley. Studio set-up, inventory, and VIP vocal-booth upkeep.',
    color: 'gray',
  },
  {
    id: 8,
    year: 2023,
    category: 'Internships',
    title: 'Audio Interface Designer, Huaxin Musical Instrument',
    displayTitle: 'Huaxin Audio',
    iconKey: 'audio-interface',
    logo: '/logos/huaxin.jpg',
    tooltipSide: 'left',
    details:
      'Audio Interface Designer at Huaxin Musical Instrument, starting 2023. Designed a soundboard-style UI in Blender and drafted specs (3 preamps, XLR + line in, multiple sample rates, USB-C) for a live-streaming / recording interface paired with an electronic piano and drum kit.',
    color: 'gray',
  },
  {
    id: 10,
    year: 2020,
    category: 'Internships',
    title: 'Music Production Intern, Jiali Music Studio',
    displayTitle: 'Jiali Music',
    iconKey: 'music',
    details:
      'Music Production Intern at Jiali Music Studio in Shanghai, summer 2020. Prepared client briefs for original soundtracks, commercial spots, and video-game music.',
    color: 'gray',
  },
  {
    id: 11,
    year: 2020,
    category: 'Internships',
    title: 'Finance Intern, Zhong Ou Fund',
    displayTitle: 'Zhong Ou Fund',
    iconKey: 'finance',
    logo: '/logos/lombarda.png',
    details:
      'Finance Intern at Zhong Ou Fund Management in Shanghai, winter 2020 to January 2021. Self-studied accounting and DCF modeling; analyzed audit-fee structures of China’s top 10 fund management firms to inform Zhong Ou’s pricing.',
    color: 'gray',
  },
  {
    id: 12,
    year: 2021,
    category: 'Internships',
    title: 'Consultant Intern, Ernst & Young',
    displayTitle: 'Ernst & Young',
    iconKey: 'ey',
    logo: '/logos/ey.webp',
    // Send the tooltip right so it sits over the empty 2022 gap rather
    // than running back across Jiali and Zhong Ou in 2020.
    tooltipSide: 'right',
    details:
      'Consultant Intern at Ernst & Young Shanghai, June–July 2021. Compiled government policy briefs for E&Y’s annual China education report, researched 3D cell printing for a due-diligence file, and benchmarked Istanbul Airport’s transfer service for Shanghai Pudong.',
    color: 'gray',
  },

  // ---------- Music Performance (orange) ----------
  {
    id: 18,
    year: 2021,
    category: 'Music Performance',
    title: 'Oxy Chamber Jazz, alto sax',
    displayTitle: 'Oxy Chamber Jazz',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    details:
      'Joined Occidental Chamber Jazz as alto saxophonist in fall 2021. Two to three performances per semester, roughly 20 in total through 2025.',
    color: 'orange',
  },
  {
    id: 19,
    year: 2022,
    category: 'Music Performance',
    title: 'Oxy Symphony Orchestra, tuba',
    displayTitle: 'Oxy Symphony',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    details:
      'Joined the Occidental Symphony Orchestra on tuba, spring 2022 through 2023. Three performances per school year, six in total.',
    color: 'orange',
  },
  {
    id: 21,
    year: 2023,
    category: 'Music Performance',
    title: 'Oxy Jazz Ensemble, tenor sax',
    displayTitle: 'Oxy Jazz Ensemble',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    forceRow: 'below-near',
    details:
      'Joined the Occidental Jazz Ensemble on tenor saxophone (plus tech support) in fall 2023. Two performances per semester, ten total through 2025.',
    color: 'orange',
  },
  {
    id: 17,
    year: 2022,
    category: 'Music Performance',
    title: 'Oxy Music YouTube edits',
    displayTitle: 'Dept YouTube',
    iconKey: 'oxy',
    logo: '/logos/oxy.png',
    tooltipSide: 'right',
    details:
      'Audio / visual editor for the Occidental Music Department’s YouTube channel, 2022. Cut and published 15 departmental performance videos.',
    color: 'orange',
  },
  {
    id: 13,
    year: 2024,
    category: 'Music Performance',
    title: 'Senior Comprehensive Project Album',
    displayTitle: 'Senior Comp Album',
    iconKey: 'mic',
    logo: '/logos/oxy.png',
    tooltipSide: 'left',
    details:
      'Senior Comprehensive Project Album, fall 2024. Player plus recording, mixing, and mastering engineer on all 11 tracks.',
    color: 'orange',
  },
  {
    id: 15,
    year: 2025,
    category: 'Music Performance',
    title: 'Bowers Museum duo with Lantao Li, tenor sax + electronics',
    displayTitle: 'Bowers Museum',
    iconKey: 'museum',
    logo: '/logos/oxy.png',
    details:
      'Bowers Museum members’ opening night reception, spring 2025. Duo performance with Lantao Li on tenor saxophone and electronics in Santa Ana.',
    color: 'orange',
  },
  {
    id: 20,
    year: 2025,
    category: 'Music Performance',
    title: 'GT Jazz Combo, tenor sax',
    displayTitle: 'GT Jazz Combo',
    iconKey: 'gt',
    logo: '/logos/gt.png',
    details:
      'Joined the Georgia Tech Jazz Combo in fall 2025 on tenor saxophone.',
    color: 'orange',
  },
];

export default timeline;
