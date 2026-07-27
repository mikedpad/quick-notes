import { browser } from '$app/environment';

/**
 * How the wall itself is set up: the surface behind the notes, how crookedly
 * they hang, how far they lift on hover, and whether they are taped.
 *
 * These are preferences rather than data — losing them costs the user nothing —
 * so they live in localStorage and never go near the repository.
 */

export const WALL_SURFACES = ['plaster', 'cork', 'charcoal'] as const;
export type WallSurface = (typeof WALL_SURFACES)[number];

/** The shape components bind to. The store satisfies it; so does a plain object. */
export type WallSettings = {
  surface: WallSurface;
  scatter: number;
  zoom: number;
  taped: boolean;
};

export const SCATTER_RANGE = { min: 0, max: 1.5, step: 0.1 } as const;
/** Up to double size: at the top of the slider a hovered note fills its neighbours. */
export const ZOOM_RANGE = { min: 1, max: 2, step: 0.05 } as const;

export const WALL_DEFAULTS: WallSettings = {
  surface: 'plaster',
  scatter: 0.7,
  zoom: 1.5,
  taped: true,
};

/**
 * Read by the pre-paint script in `app.html` as well as by this module — the
 * surface has to be on `<html>` before the first frame or the whole page
 * flashes plaster. Change the key or the `surface` field and change both.
 */
export const WALL_STORAGE_KEY = 'quick-notes:wall';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const isSurface = (value: unknown): value is WallSurface =>
  WALL_SURFACES.includes(value as WallSurface);

const number = (value: unknown, { min, max }: { min: number; max: number }, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? clamp(value, min, max) : fallback;

/**
 * Whatever is in storage is untrusted input: an older version wrote it, or
 * another tab, or nobody at all. Every field falls back on its own.
 */
export function parseSettings(raw: string | null): WallSettings {
  if (!raw) return { ...WALL_DEFAULTS };

  let stored: Partial<WallSettings>;
  try {
    stored = JSON.parse(raw) as Partial<WallSettings>;
  } catch {
    return { ...WALL_DEFAULTS };
  }
  if (typeof stored !== 'object' || stored === null) return { ...WALL_DEFAULTS };

  return {
    surface: isSurface(stored.surface) ? stored.surface : WALL_DEFAULTS.surface,
    scatter: number(stored.scatter, SCATTER_RANGE, WALL_DEFAULTS.scatter),
    zoom: number(stored.zoom, ZOOM_RANGE, WALL_DEFAULTS.zoom),
    taped: typeof stored.taped === 'boolean' ? stored.taped : WALL_DEFAULTS.taped,
  };
}

class WallStore implements WallSettings {
  #storage: Storage | undefined;
  #settings = $state<WallSettings>({ ...WALL_DEFAULTS });

  constructor(storage?: Storage) {
    this.#storage = storage;
    this.#settings = parseSettings(this.#read());
  }

  get surface(): WallSurface {
    return this.#settings.surface;
  }
  set surface(value: WallSurface) {
    this.#settings.surface = value;
    this.#save();
  }

  get scatter(): number {
    return this.#settings.scatter;
  }
  set scatter(value: number) {
    this.#settings.scatter = clamp(value, SCATTER_RANGE.min, SCATTER_RANGE.max);
    this.#save();
  }

  get zoom(): number {
    return this.#settings.zoom;
  }
  set zoom(value: number) {
    this.#settings.zoom = clamp(value, ZOOM_RANGE.min, ZOOM_RANGE.max);
    this.#save();
  }

  get taped(): boolean {
    return this.#settings.taped;
  }
  set taped(value: boolean) {
    this.#settings.taped = value;
    this.#save();
  }

  /** Back to a bare plaster wall. */
  reset(): void {
    this.#settings = { ...WALL_DEFAULTS };
    this.#save();
  }

  // Storage throws rather than returns in a locked-down browser (Safari's
  // private mode, a full quota, storage disabled entirely). None of that is
  // worth an error message: the wall works, it just forgets.
  #read(): string | null {
    try {
      return this.#storage?.getItem(WALL_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  #save(): void {
    try {
      this.#storage?.setItem(WALL_STORAGE_KEY, JSON.stringify(this.#settings));
    } catch {
      /* forgotten, not broken */
    }
  }
}

/** Exposed so tests can hand it a stub instead of the real localStorage. */
export const createWallStore = (storage?: Storage) => new WallStore(storage);

export const wall = createWallStore(browser ? localStorage : undefined);
