/** @jsxImportSource preact */
import { useRef } from 'preact/hooks';
import Code from '../Code';
import { BitFields, Bytes, COLORS, hex } from '../viz';
import { useSlideStep } from '../../deck/hooks';

/** BitFields + Bytes + Code: one risc-v instruction from bytes to meaning. Steps 0–4. */

const WORD = 0x007302b3; // add x5, x6, x7
const BYTES = [0, 1, 2, 3].map((k) => (WORD >>> (8 * k)) & 0xff); // little-endian

const FIELDS = [
  { name: 'funct7', hi: 31, lo: 25, color: COLORS.amber, value: '0' },
  { name: 'rs2', hi: 24, lo: 20, color: COLORS.blue, value: 'x7' },
  { name: 'rs1', hi: 19, lo: 15, color: COLORS.blue, value: 'x6' },
  { name: 'funct3', hi: 14, lo: 12, color: COLORS.amber, value: '0' },
  { name: 'rd', hi: 11, lo: 7, color: COLORS.green, value: 'x5' },
  { name: 'opcode', hi: 6, lo: 0, color: COLORS.slate, value: '0x33' },
];

const SRC = `
u32 opcode = inst & 0x7f;
u32 rd     = (inst >> 7)  & 0x1f;
u32 rs1    = (inst >> 15) & 0x1f;
u32 rs2    = (inst >> 20) & 0x1f;`;

const CAPTIONS = [
  '4 bytes in memory',
  'read as one 32-bit number, lowest byte first',
  "it's just bits",
  'the format puts each field at a fixed position',
  'shift and mask to pull each field out',
];

export default function DecodeDemo() {
  const root = useRef<HTMLDivElement>(null);
  const step = useSlideStep(root);
  return (
    <div ref={root} style={{ fontSize: '.8em' }}>
      <div style={{ display: 'flex', gap: '1.2em', alignItems: 'center' }}>
        <Bytes data={BYTES} label="mem[pc]" />
        <div class={`fade ${step >= 1 ? 'on' : ''}`} style={{ paddingBottom: '1.6em' }}>
          <span class="muted">→</span> <code>0x{hex(WORD, 8)}</code>
        </div>
      </div>
      <div class={`fade ${step >= 2 ? 'on' : ''}`}>
        <BitFields word={WORD} fields={FIELDS} split={step >= 3} values={step >= 4} />
      </div>
      <div style={{ display: 'flex', gap: '2em', marginTop: '.6em' }}>
        <div class={`fade ${step >= 4 ? 'on' : ''}`} style={{ fontSize: '.8em' }}><Code lang="c" code={SRC} /></div>
        <div class="caption">{CAPTIONS[step]}</div>
      </div>
    </div>
  );
}
