import { describe, expect, it } from 'vitest';
import { PAPERS, paperAt, paperVars, scatterAt } from '$lib/ui/paper';
import { PAPER_COUNT } from '$lib/domain/note';

/**
 * Presentation is mostly covered by eye, but these two functions are arithmetic
 * that the whole wall is built on: get the wrapping wrong and a note falls off
 * the end of the palette, get the determinism wrong and the wall reshuffles
 * itself on every render.
 */

describe('PAPERS', () => {
  it('stocks exactly as many papers as the domain hands out', () => {
    expect(PAPERS).toHaveLength(PAPER_COUNT);
  });

  it('gives every paper a name and three stops', () => {
    for (const paper of PAPERS) {
      expect(paper.name).toBeTruthy();
      expect(paper.light).toBeTruthy();
      expect(paper.base).toBeTruthy();
      expect(paper.shade).toBeTruthy();
    }
  });
});

describe('paperAt', () => {
  it('returns the paper at that index', () => {
    expect(paperAt(0)).toBe(PAPERS[0]);
    expect(paperAt(4)).toBe(PAPERS[4]);
  });

  it('wraps, so a grid position past the end of the palette still lands', () => {
    expect(paperAt(5)).toBe(PAPERS[0]);
    expect(paperAt(32)).toBe(PAPERS[2]);
  });

  it('wraps negatives too rather than returning undefined', () => {
    expect(paperAt(-1)).toBe(PAPERS[4]);
    expect(paperAt(-7)).toBe(PAPERS[3]);
  });
});

describe('paperVars', () => {
  it('names the three custom properties the gradient is written against', () => {
    const vars = paperVars(PAPERS[1]);

    expect(vars).toContain(`--paper-light:${PAPERS[1].light}`);
    expect(vars).toContain(`--paper-base:${PAPERS[1].base}`);
    expect(vars).toContain(`--paper-shade:${PAPERS[1].shade}`);
  });
});

describe('scatterAt', () => {
  it('is deterministic: the same place on the wall hangs the same way twice', () => {
    expect(scatterAt(3, 0.7)).toEqual(scatterAt(3, 0.7));
  });

  it('scales with the setting', () => {
    const half = scatterAt(1, 0.5);
    const full = scatterAt(1, 1);

    expect(half.rotate).toBeCloseTo(full.rotate / 2);
  });

  it('squares everything up at zero', () => {
    for (let position = 0; position < 12; position += 1) {
      const scatter = scatterAt(position, 0);
      expect(scatter.rotate).toBe(0);
      expect(scatter.drop).toBe(0);
    }
  });

  it('never repeats itself between neighbours', () => {
    const angles = Array.from({ length: 10 }, (_, i) => scatterAt(i, 1).rotate);

    expect(new Set(angles).size).toBe(angles.length);
  });

  it('hangs the tape at a different angle from the note under it', () => {
    for (let position = 0; position < 10; position += 1) {
      const scatter = scatterAt(position, 1);
      expect(scatter.tapeRotate).not.toBe(scatter.rotate);
    }
  });

  it('wraps past the end of the cycle', () => {
    expect(scatterAt(10, 1)).toEqual(scatterAt(0, 1));
    expect(scatterAt(-1, 1)).toEqual(scatterAt(9, 1));
  });

  it('drops by whole pixels, so nothing lands on a half-pixel seam', () => {
    for (let position = 0; position < 10; position += 1) {
      expect(Number.isInteger(scatterAt(position, 0.7).drop)).toBe(true);
    }
  });
});

describe('scatterAt with variance', () => {
  /** How far apart the angles are — the thing that reads as "hung by hand". */
  const spread = (variance: number) => {
    const angles = Array.from({ length: 40 }, (_, i) => Math.abs(scatterAt(i, 1, variance).rotate));
    const mean = angles.reduce((sum, a) => sum + a, 0) / angles.length;
    return Math.sqrt(angles.reduce((sum, a) => sum + (a - mean) ** 2, 0) / angles.length);
  };

  it('changes nothing at zero, which is what every wall did before it existed', () => {
    for (let position = 0; position < 12; position += 1) {
      expect(scatterAt(position, 1, 0)).toEqual(scatterAt(position, 1));
    }
  });

  it('breaks the ten-note cycle, so the wall stops repeating itself', () => {
    // Without variance these are the same note twice; the cycle is ten long.
    expect(scatterAt(0, 1, 0).rotate).toBe(scatterAt(10, 1, 0).rotate);
    expect(scatterAt(0, 1, 0.5).rotate).not.toBe(scatterAt(10, 1, 0.5).rotate);
  });

  it('spreads the angles wider the further it is turned up', () => {
    expect(spread(0.5)).toBeGreaterThan(spread(0));
    expect(spread(1)).toBeGreaterThan(spread(0.5));
  });

  it('stays deterministic, so a reload does not reshuffle the wall', () => {
    expect(scatterAt(7, 1.5, 0.5)).toEqual(scatterAt(7, 1.5, 0.5));
  });

  it('never flips a note past straight, however high it goes', () => {
    // The factor bottoms out at zero rather than going negative: a note can end
    // up straight, but never tilted the opposite way to its neighbours' pattern.
    for (let position = 0; position < 60; position += 1) {
      const { rotate } = scatterAt(position, 1, 1);
      const base = scatterAt(position, 1, 0).rotate;
      expect(Math.abs(rotate)).toBeLessThanOrEqual(Math.abs(base) * 2 + 0.01);
      if (base !== 0) expect(Math.sign(rotate) === Math.sign(base) || rotate === 0).toBe(true);
    }
  });

  it('varies rotation and drop independently', () => {
    // Drawn from one stream, the most-tilted note would always be the
    // furthest-dropped one, which looks arranged rather than careless.
    const notes = Array.from({ length: 30 }, (_, i) => scatterAt(i, 1.5, 0.8));
    const steepest = notes.indexOf(
      notes.reduce((a, b) => (Math.abs(b.rotate) > Math.abs(a.rotate) ? b : a)),
    );
    const lowest = notes.indexOf(notes.reduce((a, b) => (b.drop > a.drop ? b : a)));

    expect(steepest).not.toBe(lowest);
  });

  it('varies the tape too, so taped notes do not line up', () => {
    const tapes = Array.from({ length: 20 }, (_, i) => scatterAt(i, 1, 0.6).tapeRotate);

    expect(new Set(tapes).size).toBeGreaterThan(10);
  });
});
