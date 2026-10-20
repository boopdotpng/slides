/** @jsxImportSource preact */
import { useRef } from 'preact/hooks';
import { highlight } from '../Code';
import { Timeline } from '../viz';
import { useSlideStep } from '../../deck/hooks';

/** Timeline: the same four instructions, in order (step 0) vs out of order (step 1). */

const PROGRAM = [
  { asm: 'ld   t0, 0(a0)', note: 'load: slow' },
  { asm: 'addi t1, t0, 1', note: 'needs t0' },
  { asm: 'mul  t2, a1, a2', note: 'independent' },
  { asm: 'add  t3, a3, a4', note: 'independent' },
];
const TIMES = [
  [[0, 6], [6, 7], [7, 9], [9, 10]], // in order
  [[0, 6], [6, 7], [1, 3], [1, 2]], // out of order
];

export default function TimelineDemo() {
  const root = useRef<HTMLDivElement>(null);
  const step = useSlideStep(root);
  const times = TIMES[step];
  const total = Math.max(...times.map(([, e]) => e));
  return (
    <div ref={root}>
      <Timeline units={10} run={step}
        title={<>{step === 0 ? 'in order' : 'out of order'}: <strong>{total} cycles</strong></>}
        rows={PROGRAM.map((p, k) => ({
          label: <code style={{ background: 'none' }}>{highlight(p.asm, 'asm')}</code>,
          note: p.note, start: times[k][0], end: times[k][1],
        }))} />
    </div>
  );
}
