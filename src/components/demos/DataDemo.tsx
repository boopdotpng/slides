/** @jsxImportSource preact */
import { useRef } from 'preact/hooks';
import { Bars, COLORS, Heatmap, Shape, Strip, Tok, diverging, fmt, range, sequential } from '../viz';
import { useSlideStep } from '../../deck/hooks';

/**
 * The data marks, on made-up numbers. For real ones, export json into
 * public/data/ and load it with useData('name').
 */

const TOKENS = [' the', ' cat', ' sat', ' on'];
// a deterministic pseudo-random vector, so the build is stable
const noise = (seed: number, n: number) => range(n).map((i) => Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453 % 1);
const VEC = noise(1, 256);
const ATTN = [[1, 0, 0, 0], [.3, .7, 0, 0], [.1, .2, .7, 0], [.05, .5, .15, .3]];
const PROBS = [[.42, .21, .12, .08, .05], [.81, .07, .04, .02, .01]];
const NEXT = [[' mat', ' floor', ' bed', ' table', ' roof'], [' mat', ' rug', ' bed', ' floor', ' sofa']];

export default function DataDemo() {
  const root = useRef<HTMLDivElement>(null);
  const step = useSlideStep(root);
  return (
    <div ref={root} class="cols" style={{ alignItems: 'flex-start' }}>
      <div>
        <div class="lbl">Shape</div>
        <Shape dims={[1, 4, 256]} names={['batch', 'tokens', 'dim']} hl={step >= 1 ? [2] : []} />
        <div class="lbl" style={{ marginTop: '1em' }}>Strip (hover me)</div>
        <Strip values={step >= 1 ? VEC.map((v) => v * 3) : VEC} label="x" scale={1} />
        <div class="lbl" style={{ margin: '1em 0 1.6em' }}>Heatmap (null = masked)</div>
        <Heatmap cell={34}
          data={ATTN.map((row, r) => row.map((v, c) => (c > r ? null : step >= 1 ? v : 1 / (r + 1))))}
          color={(v) => sequential(v)} rowLabels={TOKENS.map((t) => <Tok t={t} />)}
          colLabels={TOKENS.map((t) => <Tok t={t} />)} hlRow={3}
          tipFn={(r, c, v) => (v === null ? 'masked' : `${TOKENS[r]} → ${TOKENS[c]}: <b>${fmt(v)}</b>`)} />
      </div>
      <div>
        <div class="lbl">Bars</div>
        <Bars values={PROBS[step >= 1 ? 1 : 0]} labels={NEXT[step >= 1 ? 1 : 0].map((t) => <Tok t={t} />)} hl={0} />
        <div class="lbl" style={{ marginTop: '1em' }}>Bars, signed</div>
        <Bars signed values={noise(step + 2, 5).map((v) => v * 2)} labels={['a', 'b', 'c', 'd', 'e']}
          color={(v) => (v < 0 ? COLORS.neg : COLORS.pos)} />
        <div class="lbl" style={{ marginTop: '1em' }}>diverging / sequential scales</div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {range(21).map((i) => <div style={{ width: '14px', height: '14px', background: diverging((i - 10) / 5) }} />)}
        </div>
        <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
          {range(21).map((i) => <div style={{ width: '14px', height: '14px', background: sequential(i / 20) }} />)}
        </div>
      </div>
    </div>
  );
}
