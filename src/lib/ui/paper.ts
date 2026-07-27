/**
 * The wall's stationery.
 *
 * Five papers and the scatter that pins them up, expressed as data so the CSS
 * that draws a sticky note can stay one gradient and one transform. Domain-free
 * on purpose: a paper is a set of colours and a scatter is an angle. What ends
 * up written on them is somebody else's business.
 */

export type Paper = {
  name: string;
  /** The three stops of the paper gradient: lit top, flat middle, shaded fold. */
  light: string;
  base: string;
  shade: string;
};

export const PAPERS: readonly Paper[] = [
  {
    name: 'Canary',
    light: 'oklch(0.96 0.1 102)',
    base: 'oklch(0.93 0.115 102)',
    shade: 'oklch(0.87 0.12 100)',
  },
  {
    name: 'Pink',
    light: 'oklch(0.92 0.08 356)',
    base: 'oklch(0.88 0.09 356)',
    shade: 'oklch(0.82 0.1 354)',
  },
  {
    name: 'Mint',
    light: 'oklch(0.95 0.08 152)',
    base: 'oklch(0.92 0.09 152)',
    shade: 'oklch(0.86 0.1 150)',
  },
  {
    name: 'Sky',
    light: 'oklch(0.94 0.06 226)',
    base: 'oklch(0.9 0.07 226)',
    shade: 'oklch(0.84 0.08 224)',
  },
  {
    name: 'Tangerine',
    light: 'oklch(0.92 0.09 66)',
    base: 'oklch(0.88 0.1 66)',
    shade: 'oklch(0.82 0.11 64)',
  },
];

/** Wraps, so any index — a stored colour or a place in the grid — lands on paper. */
export const paperAt = (index: number): Paper =>
  PAPERS[((Math.trunc(index) % PAPERS.length) + PAPERS.length) % PAPERS.length];

/** The custom properties the paper gradient in CSS is written against. */
export const paperVars = (paper: Paper): string =>
  `--paper-light:${paper.light};--paper-base:${paper.base};--paper-shade:${paper.shade};`;

/**
 * Ten angles and ten drops, cycled. Long enough that a row never repeats
 * itself, short enough to read as a handful of notes stuck up by hand.
 */
const ROTATIONS = [-2.4, 1.8, -1.1, 2.6, -0.7, 1.3, -3, 0.9, 2.1, -1.8];
const DROPS = [0, 6, 2, 9, 4, 0, 7, 3, 5, 1];

export type Scatter = {
  /** Degrees. */
  rotate: number;
  /** Pixels down from where the grid would have put it. */
  drop: number;
  /** Degrees. Borrowed from further along the cycle so tape and note disagree. */
  tapeRotate: number;
};

/**
 * Derived from position rather than randomised: the wall looks hand-stuck, and
 * looks the same after a reload. `amount` is the user's scatter setting, so 0
 * squares everything up without a second code path.
 */
export function scatterAt(position: number, amount: number): Scatter {
  const index = ((Math.trunc(position) % ROTATIONS.length) + ROTATIONS.length) % ROTATIONS.length;
  return {
    rotate: Number((ROTATIONS[index] * amount).toFixed(2)),
    drop: Math.round(DROPS[index] * amount),
    tapeRotate: ROTATIONS[(index + 3) % ROTATIONS.length],
  };
}
