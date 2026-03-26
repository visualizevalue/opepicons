/**
 * Options for generating an opepen icon
 */
export interface OpepenOptions {
  /** The size of the icon in pixels */
  size?: number;
  /** A string seed to generate the icon deterministically */
  seed?: string;
  /** The foreground color of the icon */
  color?: string;
  /** The background color of the icon */
  bgcolor?: string;
  /** The spot color used for specific pattern elements */
  spotcolor?: string;
}

export type Rotation = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface GridItem {
  row: number;
  col: number;
  type: 'square' | 'arc';
  rotation?: Rotation;
}

export interface PreparedIcon {
  seed: string;
  color: string;
  bgcolor: string;
  spotcolor: string;
  imageData: number[];
}

export const GRID_SIZE = 8;

export const opepenGrid: GridItem[] = [
  { row: 3, col: 3, type: 'square' },
  { row: 3, col: 4, type: 'arc', rotation: 'topRight' },
  { row: 3, col: 5, type: 'arc', rotation: 'topLeft' },
  { row: 3, col: 6, type: 'arc', rotation: 'topRight' },
  { row: 4, col: 3, type: 'arc', rotation: 'bottomLeft' },
  { row: 4, col: 5, type: 'arc', rotation: 'bottomLeft' },
  { row: 5, col: 3, type: 'square' },
  { row: 5, col: 4, type: 'square' },
  { row: 5, col: 5, type: 'square' },
  { row: 5, col: 6, type: 'square' },
  { row: 6, col: 3, type: 'arc', rotation: 'bottomLeft' },
  { row: 6, col: 4, type: 'square' },
  { row: 6, col: 5, type: 'square' },
  { row: 6, col: 6, type: 'arc', rotation: 'bottomRight' },
  { row: 8, col: 3, type: 'arc', rotation: 'topLeft' },
  { row: 8, col: 4, type: 'square' },
  { row: 8, col: 5, type: 'square' },
  { row: 8, col: 6, type: 'arc', rotation: 'topRight' },
];

// Xorshift PRNG — returns a closure with its own state so it's safe for concurrent use
export function createRng(seed: string): () => number {
  const s: number[] = [0, 0, 0, 0];

  for (let i = 0; i < seed.length; i++) {
    s[i % 4] = (s[i % 4]! << 5) - s[i % 4]! + seed.charCodeAt(i);
  }

  return () => {
    const t = s[0]! ^ (s[0]! << 11);
    s[0] = s[1]!;
    s[1] = s[2]!;
    s[2] = s[3]!;
    s[3] = s[3]! ^ (s[3]! >> 19) ^ t ^ (t >> 8);
    return (s[3]! >>> 0) / ((1 << 31) >>> 0);
  };
}

export function createColor(rand: () => number): string {
  const h = Math.floor(rand() * 360);
  const s = Math.round(rand() * 60 + 40);
  const l = Math.round((rand() + rand() + rand() + rand()) * 25);

  return `hsl(${h},${s}%,${l}%)`;
}

export function createImageData(size: number, rand: () => number): number[] {
  const width = size;
  const height = size;

  const dataWidth = Math.ceil(width / 2);
  const mirrorWidth = width - dataWidth;

  const data: number[] = [];
  for (let y = 0; y < height; y++) {
    let row: number[] = [];
    for (let x = 0; x < dataWidth; x++) {
      row[x] = Math.floor(rand() * 2.3);
    }
    const r = row.slice(0, mirrorWidth);
    r.reverse();
    row = row.concat(r);

    for (let i = 0; i < row.length; i++) {
      data.push(row[i]!);
    }
  }

  return data;
}

/**
 * Prepare all deterministic data for an opepen icon.
 * Both the canvas and SVG renderers use this.
 */
export function prepare(opts: OpepenOptions): PreparedIcon {
  const seed = opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);
  const rand = createRng(seed);

  return {
    seed,
    color: opts.color || createColor(rand),
    bgcolor: opts.bgcolor || createColor(rand),
    spotcolor: opts.spotcolor || createColor(rand),
    imageData: createImageData(GRID_SIZE, rand),
  };
}
