/** Deterministic spine palette keyed by course code prefix / hash */

const PALETTE = [
  { key: 'comp', from: '#5A2030', mid: '#7A3040', to: '#5A2030', accent: '#C4A35A' },
  { key: 'writ', from: '#1E3450', mid: '#2D4A6B', to: '#1E3450', accent: '#8AB4D4' },
  { key: 'hist', from: '#2A3A28', mid: '#3D5A3A', to: '#2A3A28', accent: '#A8C4A0' },
  { key: 'gold', from: '#6B5010', mid: '#8B6914', to: '#6B5010', accent: '#C4A35A' },
  { key: 'purple', from: '#3A2050', mid: '#4A3060', to: '#3A2050', accent: '#C4A0D4' },
  { key: 'teal', from: '#1A3A3A', mid: '#2D5A5A', to: '#1A3A3A', accent: '#7AB4B4' },
  { key: 'rust', from: '#5A3018', mid: '#7A4828', to: '#5A3018', accent: '#D4A070' },
] as const;

const PREFIX_MAP: Record<string, number> = {
  COMP: 0,
  CS: 0,
  WRIT: 1,
  ENG: 1,
  HIST: 2,
  HIS: 2,
  MATH: 3,
  BUS: 4,
  SCI: 5,
  ART: 6,
};

export type SpinePalette = (typeof PALETTE)[number];

export function spinePaletteForCode(code: string): SpinePalette {
  const prefix = (code || '').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4);
  if (PREFIX_MAP[prefix] != null) return PALETTE[PREFIX_MAP[prefix]];
  // Try 3-letter then 2-letter
  for (let n = 4; n >= 2; n--) {
    const p = prefix.slice(0, n);
    if (PREFIX_MAP[p] != null) return PALETTE[PREFIX_MAP[p]];
  }
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function spineGradient(palette: SpinePalette): string {
  return `linear-gradient(90deg, ${palette.from}, ${palette.mid} 40%, ${palette.to})`;
}

/** Slightly varied heights so spines look like a real shelf */
export function spineHeight(code: string, base = 260, spread = 50): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 33 + code.charCodeAt(i)) >>> 0;
  return base + (hash % spread) - Math.floor(spread / 4);
}

export function spineWidth(code: string, base = 58, spread = 18): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 37 + code.charCodeAt(i)) >>> 0;
  return base + (hash % spread);
}
