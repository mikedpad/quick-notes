import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SCATTER_RANGE,
  WALL_DEFAULTS,
  WALL_STORAGE_KEY,
  ZOOM_RANGE,
  createWallStore,
  parseSettings,
} from '$lib/state/wall.svelte';

/**
 * These are preferences, not data, so the interesting behaviour is all in what
 * happens when the stored copy is wrong: written by an older version, by
 * another app on the same origin, or by a browser that refuses to store
 * anything at all. None of it may take the wall down.
 */

/** localStorage, near enough — the store only ever gets/sets one key. */
function stubStorage(initial?: string): Storage {
  const entries = new Map<string, string>();
  if (initial !== undefined) entries.set(WALL_STORAGE_KEY, initial);

  return {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
    clear: () => entries.clear(),
    key: (index: number) => [...entries.keys()][index] ?? null,
    get length() {
      return entries.size;
    },
  };
}

/** A browser that has storage but will not let anyone near it. */
const hostileStorage = (): Storage => ({
  ...stubStorage(),
  getItem: () => {
    throw new Error('The operation is insecure.');
  },
  setItem: () => {
    throw new Error('The quota has been exceeded.');
  },
});

describe('parseSettings', () => {
  it('falls back to the defaults when nothing has been stored', () => {
    expect(parseSettings(null)).toEqual(WALL_DEFAULTS);
  });

  it('reads back what was written', () => {
    const settings = { surface: 'cork', scatter: 1.2, zoom: 1.35, taped: true };

    expect(parseSettings(JSON.stringify(settings))).toEqual(settings);
  });

  it('survives a value that is not JSON at all', () => {
    expect(parseSettings('{ not json')).toEqual(WALL_DEFAULTS);
  });

  it('survives JSON that is not an object', () => {
    expect(parseSettings('42')).toEqual(WALL_DEFAULTS);
    expect(parseSettings('null')).toEqual(WALL_DEFAULTS);
  });

  it('rejects a surface this version has never heard of', () => {
    expect(parseSettings('{"surface":"wallpaper"}').surface).toBe(WALL_DEFAULTS.surface);
  });

  it('clamps numbers to the range the controls offer', () => {
    const settings = parseSettings('{"scatter":99,"zoom":-4}');

    expect(settings.scatter).toBe(SCATTER_RANGE.max);
    expect(settings.zoom).toBe(ZOOM_RANGE.min);
  });

  it('lets the zoom reach double size', () => {
    expect(parseSettings('{"zoom":2}').zoom).toBe(2);
    expect(parseSettings('{"zoom":2.5}').zoom).toBe(2);
  });

  it('ignores values of the wrong type, field by field', () => {
    const settings = parseSettings('{"surface":"charcoal","scatter":"lots","taped":"yes"}');

    // The one good field is kept; the other two fall back on their own.
    expect(settings.surface).toBe('charcoal');
    expect(settings.scatter).toBe(WALL_DEFAULTS.scatter);
    expect(settings.taped).toBe(WALL_DEFAULTS.taped);
  });

  it('rejects NaN, which is a number and would otherwise stick', () => {
    expect(parseSettings('{"scatter":null}').scatter).toBe(WALL_DEFAULTS.scatter);
  });
});

describe('the wall store', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = stubStorage();
  });

  it('starts on a taped plaster wall', () => {
    const wall = createWallStore(storage);

    expect(wall.surface).toBe('plaster');
    expect(wall.scatter).toBe(0.7);
    expect(wall.zoom).toBe(1.5);
    expect(wall.taped).toBe(true);
  });

  it('opens on what was last chosen', () => {
    const wall = createWallStore(stubStorage('{"surface":"charcoal","taped":false}'));

    expect(wall.surface).toBe('charcoal');
    expect(wall.taped).toBe(false);
  });

  it('keeps a zoom saved before the slider’s range was widened', () => {
    // 1.2 was the old default. It is still inside the range, so it stands.
    expect(createWallStore(stubStorage('{"zoom":1.2}')).zoom).toBe(1.2);
  });

  it('writes every change through, so the next visit matches this one', () => {
    const wall = createWallStore(storage);

    wall.surface = 'cork';
    wall.scatter = 1.1;
    wall.zoom = 1.4;
    wall.taped = true;

    expect(createWallStore(storage)).toMatchObject({
      surface: 'cork',
      scatter: 1.1,
      zoom: 1.4,
      taped: true,
    });
  });

  it('clamps what it is set to, not just what it reads', () => {
    const wall = createWallStore(storage);

    wall.scatter = 9;
    wall.zoom = 0;

    expect(wall.scatter).toBe(SCATTER_RANGE.max);
    expect(wall.zoom).toBe(ZOOM_RANGE.min);
  });

  it('goes back to a bare wall on reset', () => {
    const wall = createWallStore(storage);
    wall.surface = 'cork';
    wall.taped = true;

    wall.reset();

    expect(wall).toMatchObject(WALL_DEFAULTS);
    expect(createWallStore(storage).surface).toBe('plaster');
  });

  it('works with no storage at all, which is what prerender gets', () => {
    const wall = createWallStore();

    wall.surface = 'cork';

    expect(wall.surface).toBe('cork');
  });

  it('forgets rather than breaks when storage refuses to co-operate', () => {
    const wall = createWallStore(hostileStorage());

    expect(wall.surface).toBe('plaster');
    expect(() => (wall.surface = 'charcoal')).not.toThrow();
    expect(wall.surface).toBe('charcoal');
  });

  it('stores one key and one key only', () => {
    const spy = vi.spyOn(storage, 'setItem');
    const wall = createWallStore(storage);

    wall.taped = true;

    expect(spy).toHaveBeenCalledWith(WALL_STORAGE_KEY, expect.any(String));
    expect(storage.length).toBe(1);
  });
});
