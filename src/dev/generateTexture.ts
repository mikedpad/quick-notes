/**
 * Regenerates the charcoal wall tile: `pnpm generateTexture`.
 *
 * Build-time authoring tool, not application code. It replaced an 838 kB
 * photographic texture that was stretched over the whole viewport: this writes a
 * seamless tile two orders of magnitude smaller, which `app.css` lays down twice
 * at two different scales and blends into the base colour. Two coprime tile
 * sizes over a gradient is what keeps a repeating texture from reading as one.
 *
 * The image is centred on mid-grey because it is composited in `soft-light`:
 * 128 is the no-op value there, so the tile modulates the wall's colour rather
 * than replacing it, and the palette stays in the stylesheet where it belongs.
 */
import * as fs from 'fs';
import * as zlib from 'zlib';

const OUTPUT = './src/lib/assets/textures/charcoal.png';

/** Power of two, so every octave's lattice divides it and the tile wraps. */
const SIZE = 256;
/** How far the texture pushes away from mid-grey. Higher reads as rougher stone. */
const CONTRAST = 0.46;
/** Fixed, so regenerating produces the same wall rather than a new one. */
const SEED = 0x5eed_1e55;

/** mulberry32 — small, fast, and good enough for something nobody can predict anyway. */
function prng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = prng(SEED);

/** Smoothstep, so the interpolation has no visible lattice creases. */
const ease = (t: number): number => t * t * (3 - 2 * t);

/**
 * Value noise on a wrapping lattice. Sampling with `% cells` on both axes is the
 * whole trick: the right edge interpolates back into the left, so the tile is
 * seamless by construction rather than by mirroring.
 */
function octave(cells: number): (x: number, y: number) => number {
  const lattice = Array.from({ length: cells * cells }, random);
  const at = (x: number, y: number) => lattice[(y % cells) * cells + (x % cells)];

  return (x, y) => {
    const fx = (x / SIZE) * cells;
    const fy = (y / SIZE) * cells;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = ease(fx - x0);
    const ty = ease(fy - y0);

    const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
    const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
    return top * (1 - ty) + bottom * ty;
  };
}

// Doubling frequency, halving amplitude. Stopping at 64 cells rather than going
// per-pixel keeps the file small: fine grain is nearly incompressible, and at
// this scale the eye reads it as noise in the render anyway.
const OCTAVES = [4, 8, 16, 32, 64].map(cells => ({ sample: octave(cells), cells }));
const TOTAL = OCTAVES.reduce((sum, _, index) => sum + 0.5 ** index, 0);

function pixel(x: number, y: number): number {
  let value = 0;
  OCTAVES.forEach(({ sample }, index) => {
    value += sample(x, y) * 0.5 ** index;
  });
  value /= TOTAL;

  // Bias downwards: charcoal is mostly dark with occasional lighter grain, not
  // an even spread either side of the middle.
  const shaped = value ** 1.25;
  return Math.max(0, Math.min(255, Math.round(128 + (shaped - 0.5) * CONTRAST * 255)));
}

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Buffer): number {
  let c = 0xffffffff;
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** PNG's five filters, scored by the standard sum-of-absolute-differences heuristic. */
function filterScanline(row: Buffer, previous: Buffer): Buffer {
  const paeth = (a: number, b: number, c: number) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    return pb <= pc ? b : c;
  };

  const candidates = [0, 1, 2, 3, 4].map(type => {
    const out = Buffer.alloc(row.length);
    for (let i = 0; i < row.length; i += 1) {
      const a = i > 0 ? row[i - 1] : 0;
      const b = previous[i];
      const c = i > 0 ? previous[i - 1] : 0;
      const predictor =
        type === 0
          ? 0
          : type === 1
            ? a
            : type === 2
              ? b
              : type === 3
                ? (a + b) >> 1
                : paeth(a, b, c);
      out[i] = (row[i] - predictor) & 0xff;
    }
    const score = out.reduce((sum, byte) => sum + (byte < 128 ? byte : 256 - byte), 0);
    return { type, out, score };
  });

  const best = candidates.reduce((a, b) => (b.score < a.score ? b : a));
  return Buffer.concat([Buffer.from([best.type]), best.out]);
}

const scanlines: Buffer[] = [];
let previous = Buffer.alloc(SIZE);
for (let y = 0; y < SIZE; y += 1) {
  const row = Buffer.alloc(SIZE);
  for (let x = 0; x < SIZE; x += 1) row[x] = pixel(x, y);
  scanlines.push(filterScanline(row, previous));
  previous = row;
}

const header = Buffer.alloc(13);
header.writeUInt32BE(SIZE, 0);
header.writeUInt32BE(SIZE, 4);
header[8] = 8; // bit depth
header[9] = 0; // colour type: greyscale
// compression, filter, interlace all stay 0

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', header),
  chunk('IDAT', zlib.deflateSync(Buffer.concat(scanlines), { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

fs.writeFileSync(OUTPUT, png);
console.log(`Wrote ${SIZE}×${SIZE} tile (${(png.length / 1024).toFixed(1)} kB) to ${OUTPUT}`);
