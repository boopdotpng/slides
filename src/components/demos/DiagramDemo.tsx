/** @jsxImportSource preact */
import { useRef } from 'preact/hooks';
import { Arrow, Box, COLORS, Reveal, Terminal } from '../viz';
import { useSlideStep } from '../../deck/hooks';

/** Box + Arrow + Terminal: a syscall round trip. Steps 0–4. */

const CAPTIONS = [
  '',
  'touch hardware directly? the cpu refuses',
  'instead, ask: ecall drops into the kernel',
  'the kernel does the work',
  'and returns to the next instruction',
];

export default function DiagramDemo() {
  const root = useRef<HTMLDivElement>(null);
  const step = useSlideStep(root);
  return (
    <div ref={root} style={{ display: 'flex', gap: '1.5em', alignItems: 'center' }}>
      <div style={{ flex: 2 }}>
        <svg viewBox="0 0 1100 520" class="diagram">
          <Box x={10} y={10} w={1080} h={120} title="your program" sub="user mode" tag="U" />
          <Box x={10} y={200} w={1080} h={120} title="kernel" sub="can touch everything" tag="S" />
          <Box x={10} y={390} w={1080} h={120} title="hardware" sub="disk · screen · network" />
          <Arrow from={[520, 130]} to={[520, 185]} on={step >= 1} color={COLORS.bad} label="sw t0, 0(uart)" />
          <Reveal on={step >= 1}>
            <text x="520" y="232" font-size="44" font-weight="700" fill={COLORS.bad} text-anchor="middle">✗</text>
          </Reveal>
          <Arrow from={[780, 130]} to={[780, 195]} on={step >= 2} color={COLORS.good} label="ecall" />
          <Arrow from={[780, 320]} to={[780, 385]} on={step >= 3} color={COLORS.good} label="write" />
          <Arrow from={[950, 195]} to={[950, 135]} on={step >= 4} color={COLORS.accent} label="sret" />
        </svg>
        <div class="caption">{CAPTIONS[step]}</div>
      </div>
      <div style={{ flex: 1, fontSize: '.6em' }}>
        <Terminal lines={step >= 3 ? ['$ ./hello', 'hello, world'] : ['$ ./hello']} />
      </div>
    </div>
  );
}
