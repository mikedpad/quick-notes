import { browser } from '$app/environment';
import { createIndexedDbRepo } from '$lib/data/adapters/indexeddb';
import { createMemoryRepo } from '$lib/data/adapters/memory';
import type { NotesRepo } from '$lib/data/repo';

export type { NotesRepo } from '$lib/data/repo';

/**
 * The one place that decides where notes live.
 *
 * IndexedDB does not exist during prerender, so the server pass gets an empty
 * in-memory repo and renders the shell; the browser then loads the real data.
 * Swapping storage — or pointing at a remote backend later — is a change to
 * this function alone.
 */
export function createRepo(): NotesRepo {
  return browser ? createIndexedDbRepo() : createMemoryRepo();
}
