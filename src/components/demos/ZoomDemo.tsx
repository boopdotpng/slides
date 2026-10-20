/** @jsxImportSource preact */
import type { ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';
import { COLORS, nest, ZOOM_FULL, ZOOM_H, ZOOM_W, ZoomStage, ZoomView, type Rect } from '../viz';
import { useSlideStep } from '../../deck/hooks';

/** ZoomStage: machine → cpu → core 0 → back out. Steps 0–3. */

const CPU: Rect = [60, 140, 900, 900 * ZOOM_H / ZOOM_W];
const coreRect = (i: number): Rect => [60 + (i % 2) * 680, 150 + Math.floor(i / 2) * 305, 600, 600 * ZOOM_H / ZOOM_W];
const CAMERA = [ZOOM_FULL, CPU, nest(CPU, coreRect(0)), ZOOM_FULL];
const CAPTIONS = ['a machine', 'zoom into the cpu', 'and into one core', 'and back out'];

const Label = ({ x, y, size, muted, children }: { x: number; y: number; size: number; muted?: boolean; children: ComponentChildren }) => (
  <text x={x} y={y} font-size={size} fill={muted ? 'var(--muted)' : 'var(--fg)'} font-weight={muted ? 400 : 700}>{children}</text>
);
// every view is drawn in ZOOM_W × ZOOM_H, whatever size it ends up on screen
const Frame = ({ color = '#333' }: { color?: string }) => (
  <rect width={ZOOM_W} height={ZOOM_H} rx={36} fill="#141414" stroke={color} stroke-width={5} />
);

function Core({ n }: { n: number }) {
  return (
    <g>
      <Frame color={COLORS.accent} />
      <Label x={60} y={120} size={80}>core {n}</Label>
      {['pc', 'registers', 'l1 cache', 'alu'].map((t, i) => (
        <g>
          <rect x={60 + i * 380} y={240} width={340} height={300} rx={20} fill="#1c1c1c" />
          <text x={230 + i * 380} y={400} font-size={44} fill="var(--fg)" text-anchor="middle">{t}</text>
        </g>
      ))}
    </g>
  );
}

function Cpu() {
  return (
    <g>
      <Frame />
      <Label x={60} y={110} size={64}>cpu</Label>
      {[0, 1, 2, 3].map((i) => <ZoomView at={coreRect(i)}><Core n={i} /></ZoomView>)}
    </g>
  );
}

export default function ZoomDemo() {
  const root = useRef<HTMLDivElement>(null);
  const step = useSlideStep(root);
  return (
    <div ref={root}>
      <ZoomStage camera={CAMERA[step]}>
        <rect width={ZOOM_W} height={ZOOM_H} rx={24} fill="#0f0f0f" stroke="#262626" stroke-width={2} />
        <Label x={60} y={90} size={48}>machine</Label>
        <ZoomView at={CPU}><Cpu /></ZoomView>
        <rect x={1020} y={140} width={520} height={250} rx={20} fill="#141414" stroke="#333" stroke-width={3} />
        <Label x={1060} y={210} size={40}>ram</Label>
        <rect x={1020} y={430} width={520} height={250} rx={20} fill="#141414" stroke="#333" stroke-width={3} />
        <Label x={1060} y={500} size={40}>disk</Label>
      </ZoomStage>
      <div class="caption">{CAPTIONS[step]}</div>
    </div>
  );
}
