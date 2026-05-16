// Albums + tracks. All recordings on this page were performed, recorded,
// mixed, and mastered by James Wang. `composer` is the writer credit for
// covers; set to null for originals.
//
// Drop album cover art at /audio/<slug>/cover.jpg and set coverImage to that
// path. New tracks: drop mastered MP3s under /audio/<slug>/<track-slug>.mp3
// and add an entry below.

const albums = [
  {
    id: 'special',
    slug: 'special',
    title: 'Special',
    year: 2025,
    role: 'Performer, recording, mix, master',
    coverImage: null,
    accentColor: '#a05a3c',
    liner: {
      notes:
        'A collected work of individual covers and Chamber Jazz performances, recorded between Tritone Studio, Choi Studio at Occidental College, and Georgia Tech Studio.',
      credits: [
        { role: 'Vocals', names: ['Haowen Luo', 'Aleksandra Teng Ma', 'Clare Kennerly', 'Lantao Li'] },
        { role: 'Saxophone', names: ['James Wang', 'Lucas Pan', 'Leslie Garcia'] },
        { role: 'Piano', names: ['Ben Langer Weida', 'James Wang'] },
        { role: 'Bass', names: ['Jonathan Richards', 'Ryan Baker', 'Will Gram'] },
        { role: 'Drums', names: ['Luca Nisimblat', 'Noel Alben', 'James Wang', 'Ryan Gero'] },
        { role: 'Guitar', names: ['Jazzbird Molina', 'James Wang', 'Marcus Parker', 'Jerry Wu'] },
        { role: 'Mix & Master', names: ['James Wang'] },
      ],
    },
    tracks: [
      {
        id: 'sp-anthropology',
        title: 'Anthropology',
        composer: 'Charlie Parker, Dizzy Gillespie',
        file: '/audio/special/anthropology.mp3',
      },
      {
        id: 'sp-black-narcissus',
        title: 'Black Narcissus',
        composer: 'Joe Henderson',
        file: '/audio/special/black-narcissus.mp3',
      },
      {
        id: 'sp-falling',
        title: 'Falling',
        composer: 'Clare Kennerly',
        file: '/audio/special/falling.mp3',
      },
      {
        id: 'sp-id-rather-go-blind',
        title: "I'd Rather Go Blind",
        composer: 'Billy Foster',
        file: '/audio/special/id-rather-go-blind.mp3',
      },
      {
        id: 'sp-no-fear',
        title: 'No Fear In My Heart',
        composer: '朴树（Pu Shu）',
        file: '/audio/special/no-fear-in-my-heart.mp3',
      },
      {
        id: 'sp-november-nights',
        title: 'November Nights',
        composer: 'Lucas Pan',
        file: '/audio/special/november-nights.mp3',
      },
      {
        id: 'sp-tanri-aski',
        title: 'Tanrı Aşkı Yarattı',
        composer: 'Anonim',
        file: '/audio/special/tanri-aski-yaratti.mp3',
      },
      {
        id: 'sp-tears-dry',
        title: 'Tears Dry on Their Own',
        composer: 'Amy Winehouse, Nickolas Ashford, Valerie Simpson',
        file: '/audio/special/tears-dry.mp3',
      },
      {
        id: 'sp-hui-jia',
        title: '回家 (Going Home)',
        composer: 'Kenny G, Walter Afanasieff',
        file: '/audio/special/hui-jia.mp3',
      },
      {
        id: 'sp-ye-lai-xiang',
        title: '夜来香',
        composer: '黎锦光（Li Jinguang）',
        file: '/audio/special/ye-lai-xiang.mp3',
      },
      {
        id: 'sp-piao-xiang',
        title: '飘向远方',
        composer: 'Lantao Li, James Wang',
        file: '/audio/special/piao-xiang-yuan-fang.mp3',
      },
    ],
  },

  {
    id: 'oxyjazz-a',
    slug: 'oxyjazz-a',
    title: "OxyJazz '24, Side A",
    year: 2024,
    role: 'Saxophone, recording, mix, master',
    coverImage: null,
    accentColor: '#b89020',
    liner: {
      notes:
        'End-of-year performance of the Occidental College Chamber Jazz ensemble, directed by Jonathan Richards. Recorded at Tritone Studio in Los Angeles.',
      credits: [
        { role: 'Performers', names: ['Occidental College Chamber Jazz Ensemble'] },
        { role: 'Music Director', names: ['Jonathan Richards'] },
        { role: 'Recording', names: ['Tritone Studio'] },
        { role: 'Mix & Master', names: ['James Wang'] },
      ],
    },
    tracks: [
      {
        id: 'oa-afro-blue',
        title: 'Afro Blue',
        composer: 'Robert Glasper',
        file: '/audio/oxyjazz-a/afro-blues.mp3',
      },
      {
        id: 'oa-armandos-rhumba',
        title: "Armando's Rhumba",
        composer: 'Chick Corea',
        file: '/audio/oxyjazz-a/armandos-rhumba.mp3',
      },
      {
        id: 'oa-but-not-for-me',
        title: 'But Not For Me',
        composer: 'Ira Gershwin',
        file: '/audio/oxyjazz-a/but-not-for-me.mp3',
      },
      {
        id: 'oa-cat-and-kittens',
        title: 'Cat and Kittens',
        composer: 'Mason Chesser',
        file: '/audio/oxyjazz-a/cat-and-kittens.mp3',
      },
      {
        id: 'oa-continuum',
        title: 'Continuum',
        composer: 'Jaco Pastorius',
        file: '/audio/oxyjazz-a/continuum.mp3',
      },
      {
        id: 'oa-edda',
        title: 'Edda',
        composer: 'Wayne Shorter',
        file: '/audio/oxyjazz-a/edda.mp3',
      },
      {
        id: 'oa-moanin',
        title: "Moanin'",
        composer: 'Bobby Timmons',
        file: '/audio/oxyjazz-a/moanin.mp3',
      },
      {
        id: 'oa-roy-allan',
        title: 'Roy Allan',
        composer: 'Roy Hargrove',
        file: '/audio/oxyjazz-a/roy-allan.mp3',
      },
      {
        id: 'oa-song-for-my-father',
        title: 'Song for My Father',
        composer: 'Horace Silver',
        file: '/audio/oxyjazz-a/song-for-my-father.mp3',
      },
      {
        id: 'oa-tio-macaco',
        title: 'Tio Macaco',
        composer: 'Michael League',
        file: '/audio/oxyjazz-a/tio-macaco.mp3',
      },
      {
        id: 'oa-you-dont-know',
        title: "You Don't Know What Love Is",
        composer: 'Don Raye, Gene de Paul',
        file: '/audio/oxyjazz-a/you-dont-know-what-love-is.mp3',
      },
    ],
  },

  {
    id: 'oxyjazz-b',
    slug: 'oxyjazz-b',
    title: "OxyJazz '24, Side B",
    year: 2024,
    role: 'Saxophone, recording, mix, master',
    coverImage: null,
    accentColor: '#9a8a28',
    liner: {
      notes:
        'End-of-year performance of the Occidental College Chamber Jazz ensemble, directed by Jonathan Richards. Recorded at Choi Studio at Occidental College.',
      credits: [
        { role: 'Performers', names: ['Occidental College Chamber Jazz Ensemble'] },
        { role: 'Music Director', names: ['Jonathan Richards'] },
        { role: 'Recording, Mix & Master', names: ['James Wang'] },
      ],
    },
    tracks: [
      {
        id: 'ob-auld-lang-syne',
        title: 'Auld Lang Syne',
        composer: 'Traditional',
        file: '/audio/oxyjazz-b/auld-lang-syne.mp3',
      },
      {
        id: 'ob-beatrice',
        title: 'Beatrice',
        composer: 'Sam Rivers',
        file: '/audio/oxyjazz-b/beatrice.mp3',
      },
      {
        id: 'ob-bolivia',
        title: 'Bolivia',
        composer: 'Cedar Walton',
        file: '/audio/oxyjazz-b/bolivia.mp3',
      },
      {
        id: 'ob-masons-untitled',
        title: "Mason's Untitled",
        composer: 'Mason Chesser',
        file: '/audio/oxyjazz-b/masons-untitled.mp3',
      },
      {
        id: 'ob-my-ideal',
        title: 'My Ideal',
        composer: 'Richard Whiting, Newell Chase, Leo Robin',
        file: '/audio/oxyjazz-b/my-ideal.mp3',
      },
      {
        id: 'ob-ornithology',
        title: 'Ornithology',
        composer: 'Charlie Parker, Benny Harris',
        file: '/audio/oxyjazz-b/ornithology.mp3',
      },
      {
        id: 'ob-red-room',
        title: 'Red Room',
        composer: 'Hiatus Kaiyote',
        file: '/audio/oxyjazz-b/red-room.mp3',
      },
      {
        id: 'ob-the-greeting',
        title: 'The Greeting',
        composer: 'McCoy Tyner',
        file: '/audio/oxyjazz-b/the-greeting.mp3',
      },
      {
        id: 'ob-this-is-for-albert',
        title: 'This is for Albert',
        composer: 'Wayne Shorter',
        file: '/audio/oxyjazz-b/this-is-for-albert.mp3',
      },
      {
        id: 'ob-tribal-dance',
        title: 'Tribal Dance',
        composer: 'Robert Glasper',
        file: '/audio/oxyjazz-b/tribal-dance.mp3',
      },
      {
        id: 'ob-wake-up-call',
        title: 'Wake Up Call',
        composer: 'Chick Corea',
        file: '/audio/oxyjazz-b/wake-up-call.mp3',
      },
      {
        id: 'ob-whisper-not',
        title: 'Whisper Not',
        composer: 'Benny Golson',
        file: '/audio/oxyjazz-b/whisper-not.mp3',
      },
      {
        id: 'ob-youre-everything',
        title: "You're Everything",
        composer: 'Chick Corea',
        file: '/audio/oxyjazz-b/youre-everything.mp3',
      },
    ],
  },

  {
    id: 'electronics',
    slug: 'electronics',
    title: 'Electronics',
    year: 2024,
    role: 'Composition, performance, mix, master',
    coverImage: null,
    accentColor: '#3b5c8a',
    liner: {
      notes:
        'Original compositions exploring virtual and physical synths and other virtual instruments.',
      credits: [
        { role: 'Composed & Performed', names: ['James Wang'] },
        { role: 'Recording, Mix & Master', names: ['James Wang'] },
      ],
    },
    tracks: [
      {
        id: 'el-chaosis',
        title: 'Chaosis',
        composer: 'James Wang',
        file: '/audio/electronics/chaosis.mp3',
      },
      {
        id: 'el-jamie-turn-red',
        title: 'Turn Red',
        composer: 'James Wang',
        file: '/audio/electronics/james-and-jamie-turn-red.mp3',
      },
      {
        id: 'el-nocturne',
        title: 'Nocturne March',
        composer: 'James Wang',
        file: '/audio/electronics/james-wang-nocturne-march.mp3',
      },
      {
        id: 'el-realjourn',
        title: 'RealJourn',
        composer: 'James Wang',
        file: '/audio/electronics/realjourn.mp3',
      },
    ],
  },

  {
    id: 'berret-yuffee',
    slug: 'berret-yuffee-ep',
    title: "Berret Yuffee's EP",
    year: 2023,
    role: 'Producer, recording, mix, master',
    coverImage: null,
    accentColor: '#7a4a52',
    liner: {
      notes: 'Original compositions by Berret Yuffee.',
      credits: [
        { role: 'Guitar', names: ['Berret Yuffee'] },
        { role: 'Producer, Recording, Mix & Master', names: ['James Wang'] },
      ],
    },
    tracks: [
      {
        id: 'by-fragile',
        title: 'Fragile',
        composer: 'Berret Yuffee',
        file: '/audio/berret-yuffee-ep/fragile.mp3',
      },
      {
        id: 'by-imposters',
        title: 'Imposters',
        composer: 'Berret Yuffee',
        file: '/audio/berret-yuffee-ep/imposters.mp3',
      },
      {
        id: 'by-ada-limon',
        title: 'Ada Limon',
        composer: 'Berret Yuffee',
        file: '/audio/berret-yuffee-ep/ada-limon.mp3',
      },
    ],
  },
];

export default albums;
