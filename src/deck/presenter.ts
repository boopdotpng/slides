/**
 * Presenter view (?presenter, opened with p from the deck).
 *
 * The page still holds the whole deck (hidden), so navigation and step counting
 * are the same code as the deck window. On top it shows:
 *   - the current slide and what the next press will show, as ?embed iframes
 *   - the slide's notes: every <aside class="notes"> in it
 *   - elapsed time (click to reset) and the clock
 */

// slides are laid out at this size in the previews, then scaled to fit
const W = 1600, H = 900;

type Pos = { slide: number; step: number; total: number };

export function initPresenter({ slides, position, onChange }: {
  slides: HTMLElement[];
  position: () => Pos;
  onChange: (f: () => void) => void;
}) {
  const root = document.createElement('div');
  root.id = 'presenter';
  root.innerHTML = `
    <div class="pv-main"><div class="pv-frame"><iframe tabindex="-1"></iframe></div></div>
    <div class="pv-side">
      <div class="pv-label">next</div>
      <div class="pv-frame pv-next"><iframe tabindex="-1"></iframe><div class="pv-end">end</div></div>
      <div class="pv-meta">
        <span class="pv-pos"></span>
        <span class="pv-timer" title="click to reset">0:00</span>
        <span class="pv-clock"></span>
      </div>
      <div class="pv-notes"></div>
    </div>`;
  document.body.append(root);

  const [cur, nxt] = [...root.querySelectorAll('iframe')];
  const end = root.querySelector<HTMLElement>('.pv-end')!;
  const pos = root.querySelector<HTMLElement>('.pv-pos')!;
  const notes = root.querySelector<HTMLElement>('.pv-notes')!;
  const timer = root.querySelector<HTMLElement>('.pv-timer')!;
  const clock = root.querySelector<HTMLElement>('.pv-clock')!;

  // only the fragment changes after the first load, so the iframes don't reload
  const embed = (hash: string) => `${location.pathname}?embed#${hash}`;

  function update() {
    const { slide, step, total } = position();
    cur.src = embed(`${slide + 1}.${step}`);
    const atEnd = step >= total && slide >= slides.length - 1;
    end.style.display = atEnd ? 'flex' : 'none';
    if (!atEnd) nxt.src = embed(step < total ? `${slide + 1}.${step + 1}` : `${slide + 2}`);
    pos.textContent = `${slide + 1} / ${slides.length}` + (total ? `  ·  step ${step} / ${total}` : '');
    const n = [...slides[slide].querySelectorAll('.notes')].map((e) => e.innerHTML).join('');
    notes.innerHTML = n || '<span class="pv-none">no notes</span>';
  }

  // scale each W×H iframe to its box
  for (const frame of root.querySelectorAll<HTMLElement>('.pv-frame')) {
    const iframe = frame.querySelector('iframe')!;
    Object.assign(iframe.style, { width: `${W}px`, height: `${H}px` });
    new ResizeObserver(() => {
      const s = Math.min(frame.clientWidth / W, frame.clientHeight / H);
      iframe.style.transform = `scale(${s})`;
    }).observe(frame);
  }

  // timer starts at the first move, not when the window opens
  let started: number | undefined;
  const pad = (n: number) => String(n).padStart(2, '0');
  timer.onclick = () => (started = Date.now());
  setInterval(() => {
    const s = started ? Math.floor((Date.now() - started) / 1000) : 0;
    timer.textContent = `${Math.floor(s / 60)}:${pad(s % 60)}`;
    const d = new Date();
    clock.textContent = `${d.getHours()}:${pad(d.getMinutes())}`;
  }, 500);

  onChange(() => {
    started ??= Date.now();
    update();
  });
  update();
}
