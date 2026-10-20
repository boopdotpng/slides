# slides

A template for educational slide decks: Astro + Preact islands. Slides are
plain `.astro` / `.mdx` files; anything animated or interactive is an island
that reacts to the deck's step counter.

## start a new deck

```sh
bunx degit boopdotpng/slides my-deck   # or "Use this template" on github
cd my-deck
bun install
bun dev                                # http://localhost:4321
```

Then:
1. set the title in `src/deck.config.ts`
2. delete the demo slides in `src/slides/` (and `src/components/demos/`) once you've seen them
3. write `src/slides/01-whatever.astro`, `02-….astro`, …

`bun run build` makes a static site in `dist/`. `bun run check` typechecks.

## presenting

| key | |
|---|---|
| → space l j | next step / slide |
| ← h k | back (going back into a slide lands fully revealed) |
| g | slide picker: type a number + enter, or ↑↓ + enter (or click the counter) |
| p | presenter window: notes, next-step preview, timer. Synced both ways with the deck |
| f | fullscreen |
| home / end | first / last |

The URL keeps your place: `#7.3` is slide 7, step 3.
`?print` shows every slide fully revealed, one per page: cmd+p → save as pdf (1600×900 pages, backgrounds on).

## writing slides

One file per slide in `src/slides/`, ordered by filename. Title in the picker
comes from `data-title`, else the first h1/h2, else the filename.

```astro
---
import Code from '../components/Code.tsx';
import MyThing from '../components/MyThing.tsx';
---
<h2>title</h2>
<p class="step">revealed on the first →</p>
<Code lang="c" code={src} hl={[2, 3]} />
<div data-steps="4"><MyThing client:load /></div>   <!-- island gets 4 more steps -->
<div class="full"><img src="/diagram.svg" alt="…"></div>  <!-- full-slide image from public/ -->
<aside class="notes">only visible in the presenter window</aside>
```

Classes in `styles/deck.css`: `step`, `cols`, `small`, `muted`, `accent`,
`center`, `full`, `caption`, `fade` + `on`, `notes`. Theme colors and fonts are
the variables at the top of that file.

## islands

Copy `src/components/TemplateIsland.tsx`. Hooks (`src/deck/hooks.ts`):

- `useSlideStep(ref)`: current step, for step-driven animation. Render purely from it.
- `useSlideActive(ref)`: is this slide on screen
- `useFrame(ref, ms => …)`: per-frame callback while on screen, ms since entering
- `useTicker(ref, ms)`: a counter that runs by itself while on screen

## components

- `Code`: tiny highlighter for `asm` (risc-v / x86 / arm names), `c`, `cpp`, `py`. `hl` highlights lines and dims the rest; `highlight(line, lang)` for inline.
- `components/viz` (see the demo slides for each one in use):
  - `Walkthrough`: code + state table + caption, stepped or `auto`
  - `BitFields`, `Bytes`: binary words split into fields, memory as byte cells
  - `Timeline`: bars growing on a time axis (pipelines, schedules)
  - `LatencyRace`: log-scaled ping dots with honest counters
  - `Box`, `Arrow`, `Reveal`: SVG diagrams with self-drawing arrows
  - `Terminal`: types out new output
  - `Strip`, `Heatmap`, `HeatCanvas`, `Bars`, `Shape`, `Tok`, `Crumbs`: data marks
  - `diverging`, `sequential`, `COLORS`, `useData('name')` (loads `public/data/name.json`), `tip`

## layout

```
src/
  deck.config.ts        title
  deck/                 the engine: deck.ts (nav, steps, picker, modes), presenter.ts, hooks.ts
  pages/index.astro     loads every slide into one page
  slides/               your slides
  components/           Code, TemplateIsland, viz/, demos/
  styles/               deck.css (engine + theme), viz.css
public/                 images, fonts (Paper Mono, OFL), data/
```

Code font is [Paper Mono](https://github.com/paper-design/paper-mono) (SIL OFL,
license in `public/fonts/`). If you deploy under a subpath (`base` in
`astro.config.mjs`), update the `/fonts/` and `/example.svg` URLs too.
