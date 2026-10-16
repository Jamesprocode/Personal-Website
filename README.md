# James Wang — Personal Website

**[Visit the website → jameswangjiayi.com](https://jameswangjiayi.com/)**

The personal portfolio of Jiayi (James) Wang: music technology researcher, jazz saxophonist, audio engineer, and developer. The site brings together research projects, recordings, performances, and the academic and professional experiences that connect them.

## Design philosophy

**The Analog Workshop** is the guiding idea: a welcoming studio where visitors can explore the work through the objects and rituals of making music. Research, engineering, and performance are connected parts of one practice. The design makes those connections tangible through a tape shelf, a working turntable, and a chronology built from discs.

### Three rooms, one workshop

The homepage is the entrance. Performance and studio photographs, recording-viewfinder details, and a curtain reveal introduce the person behind the work. From there, visitors can choose one of three rooms:

| Room | Musical object | Experience |
| --- | --- | --- |
| [Projects](https://jameswangjiayi.com/projects) | Cassette tapes | Pick a tape from the shelf, preview the research or system, and press Play to open the project. |
| [Music](https://jameswangjiayi.com/music) | Vinyl records | Browse the album crate, read liner notes and credits, and listen on an interactive turntable. |
| [Timeline](https://jameswangjiayi.com/timeline) | Compact discs | Explore academic, internship, and music performance milestones on three parallel tracks; hover over a disc for its story or click to pin it. |

Each room gives its content a distinct form while sharing the same sense of craft. Visitors can arrive for the research, stay to hear the music, and discover how the two have developed together.

### Music as an interaction language

The musical elements have jobs to do. Tapes organize projects; records support listening; CDs mark moments in time. Play, pause, rewind, volume, and seeking borrow familiar actions from audio equipment. A conductor's baton cursor and musical-note trails extend that character into the smaller details.

Listening can continue as visitors move between rooms. Once a track is started, a floating vinyl player offers playback controls elsewhere on the site. Audio begins with the visitor's choice.

### Warm materials, quiet confidence

Cream and amber, walnut and espresso, and a shared brass-gold accent evoke paper sleeves, studio furniture, and analog equipment. Light mode feels like a sunlit parlor; dark mode carries the warmth into an evening listening lounge. Space Grotesk provides the main voice, with JetBrains Mono for technical labels and controls.

Generous spacing, clear typography, and deliberate motion give the work room to speak. The aim is curiosity followed by trust: visitors should be able to hear the recordings, inspect the projects, and find the CV or contact details easily.

### Usability is part of the craft

English and Chinese language support, responsive layouts, light and dark themes, and reduced-motion alternatives help visitors explore at their own pace. Animation supports orientation and the feel of physical objects; the content remains the reason to visit.

## Local development

Built with React and Vite, with React Router, Framer Motion, GSAP, and i18next. The production build is served through Cloudflare Workers Static Assets.

```sh
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run build` | Create the production site in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the existing Node test suite. |

See [PRODUCT.md](PRODUCT.md) for audience and product principles, [DESIGN.md](DESIGN.md) for the visual system, and [wrangler.jsonc](wrangler.jsonc) for hosting configuration.
