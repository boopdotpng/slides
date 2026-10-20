/** @jsxImportSource preact */
import type { ComponentChildren } from 'preact';

/**
 * SVG pieces for box-and-arrow diagrams (from the risc-v deck's kernel layers
 * slide). Arrows draw themselves on when `on` turns true, so tie `on` to the
 * slide step:
 *
 *   <svg viewBox="0 0 1100 520" class="diagram">
 *     <Box x={10} y={10} w={1080} h={120} title="your program" sub="user mode" />
 *     <Arrow from={[780, 130]} to={[780, 195]} on={step >= 1} color={COLORS.good} label="ecall" />
 *   </svg>
 */

export function Box({ x, y, w, h, title, sub, tag, fill = '#141414', stroke = '#262626', rx = 14, children }: {
  x: number; y: number; w: number; h: number;
  title?: string; sub?: string;
  /** small accent text, top-right */
  tag?: string;
  fill?: string; stroke?: string; rx?: number;
  children?: ComponentChildren;
}) {
  return (
    <g class="box">
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} />
      {title && <text x={x + 30} y={y + 50} font-size="32" font-weight="700" fill="var(--fg)">{title}</text>}
      {sub && <text x={x + 30} y={y + 90} font-size="22" fill="var(--muted)">{sub}</text>}
      {tag && <text x={x + w - 30} y={y + 50} font-size="22" fill="var(--accent)" text-anchor="end">{tag}</text>}
      {children}
    </g>
  );
}

/** Straight arrow that draws itself from `from` to `to`; the label sits beside its middle. */
export function Arrow({ from: [x1, y1], to: [x2, y2], on = true, color = 'var(--accent)', label, width = 4, labelOffset = [16, 8] }: {
  from: [number, number]; to: [number, number];
  on?: boolean; color?: string; label?: string; width?: number;
  labelOffset?: [number, number];
}) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len]; // unit direction
  const [px, py] = [-uy, ux]; // perpendicular
  const head = 14, half = 9;
  const [bx, by] = [x2 - ux * head, y2 - uy * head]; // base of the head
  return (
    <g class={`arrow ${on ? 'on' : ''}`} style={{ color }}>
      <path d={`M ${x1} ${y1} L ${x2 - ux * 10} ${y2 - uy * 10}`} pathLength={1} fill="none" stroke="currentColor" stroke-width={width} />
      <path class="head" d={`M ${bx + px * half} ${by + py * half} L ${x2} ${y2} L ${bx - px * half} ${by - py * half} z`} fill="currentColor" />
      {label && (
        <text x={(x1 + x2) / 2 + labelOffset[0]} y={(y1 + y2) / 2 + labelOffset[1]} fill="currentColor" font-size="22"
          font-family="var(--mono)">{label}</text>
      )}
    </g>
  );
}

/** Text / mark that fades in when `on` (e.g. a ✗ where an arrow is blocked). */
export function Reveal({ on, children }: { on: boolean; children: ComponentChildren }) {
  return <g class={`reveal ${on ? 'on' : ''}`}>{children}</g>;
}
