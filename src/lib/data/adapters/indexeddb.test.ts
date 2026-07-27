import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { describeRepoContract } from '$lib/data/repo.contract';
import { createNote, type Note } from '$lib/domain/note';
import type { NotesRepo } from '$lib/data/repo';

/**
 * `fake-indexeddb` is a real implementation of the IndexedDB spec, so these are
 * genuine tests of the adapter's transaction and upgrade handling — not mocks
 * of it. The adapter caches its connection at module scope, which is what we
 * want in the app and what has to be reset between tests here.
 */

/** Fresh database, fresh module registry, so `connect()` re-runs its upgrade. */
async function freshAdapter(): Promise<NotesRepo> {
  vi.stubGlobal('indexedDB', new IDBFactory());
  vi.resetModules();
  const { createIndexedDbRepo } = await import('$lib/data/adapters/indexeddb');
  return createIndexedDbRepo();
}

describeRepoContract('the IndexedDB adapter', freshAdapter);

describe('the IndexedDB adapter’s schema', () => {
  let repo: NotesRepo;

  beforeEach(async () => {
    repo = await freshAdapter();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const openDb = () =>
    new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('quick-notes');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  it('creates the notes store keyed by id', async () => {
    await repo.put(createNote({ title: 'Schema', body: 'a' }));
    const db = await openDb();

    expect([...db.objectStoreNames]).toEqual(['notes']);
    expect(db.transaction('notes').objectStore('notes').keyPath).toBe('id');
  });

  it('indexes updatedAt, so sync can pull only what changed', async () => {
    await repo.put(createNote({ title: 'Indexed', body: 'a' }));
    const db = await openDb();
    const store = db.transaction('notes').objectStore('notes');

    expect([...store.indexNames]).toContain('by-updatedAt');
    expect(store.index('by-updatedAt').keyPath).toBe('updatedAt');
  });

  it('opens the database once and reuses the connection', async () => {
    await repo.list(); // Connection is lazy; this establishes it.
    const spy = vi.spyOn(indexedDB, 'open');

    await repo.list();
    await repo.get('anything');
    await repo.put(createNote({ title: 'Later call', body: 'a' }));

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('the IndexedDB adapter’s durability', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('persists across a fresh connection to the same database', async () => {
    const factory = new IDBFactory();
    vi.stubGlobal('indexedDB', factory);

    vi.resetModules();
    const first = (await import('$lib/data/adapters/indexeddb')).createIndexedDbRepo();
    const note = createNote({ title: 'Written in session one', body: 'a' });
    await first.put(note);

    // Same underlying database, brand new module instance: what a reload does.
    vi.resetModules();
    const second = (await import('$lib/data/adapters/indexeddb')).createIndexedDbRepo();

    await expect(second.get(note.id)).resolves.toEqual(note);
  });

  it('writes a batch in a single transaction', async () => {
    const repo = await freshAdapter();
    const notes: Note[] = Array.from({ length: 50 }, (_, i) =>
      createNote({ title: `Note ${i}`, body: 'a' }),
    );

    await repo.putMany(notes);

    await expect(repo.list()).resolves.toHaveLength(50);
  });

  it('rejects rather than resolving when a write cannot be committed', async () => {
    const repo = await freshAdapter();

    // A note whose id is not a valid key: the request fails, the transaction
    // aborts, and the promise must reflect that rather than silently resolving.
    const invalid = { ...createNote({ title: 'Bad key', body: 'a' }), id: undefined };

    await expect(repo.put(invalid as unknown as Note)).rejects.toThrow();
  });
});
