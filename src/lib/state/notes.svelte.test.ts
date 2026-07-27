import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRepo } from '$lib/data/adapters/memory';
import { createNotesStore } from '$lib/state/notes.svelte';
import { createNote, deleteNote, type Note } from '$lib/domain/note';
import type { NotesRepo } from '$lib/data/repo';

/**
 * The store is the piece components actually talk to, so these tests are the
 * ones that would catch a regression a user would notice. They run against the
 * memory adapter, which `repo.contract.ts` proves behaves like IndexedDB.
 */

const note = (title: string, updatedAt?: string): Note => {
  const created = createNote({ title, body: `Body of ${title}` });
  return updatedAt ? { ...created, updatedAt } : created;
};

/** A repo that fails on write, for testing the error paths. */
const failingRepo = (message: string, initial: Note[] = []): NotesRepo => ({
  ...createMemoryRepo(initial),
  put: () => Promise.reject(new Error(message)),
  putMany: () => Promise.reject(new Error(message)),
});

describe('init', () => {
  it('starts idle and empty', () => {
    const store = createNotesStore(createMemoryRepo());

    expect(store.status).toBe('idle');
    expect(store.notes).toEqual([]);
    expect(store.count).toBe(0);
  });

  it('loads existing notes from storage', async () => {
    const store = createNotesStore(createMemoryRepo([note('Stored')]));
    await store.init();

    expect(store.status).toBe('ready');
    expect(store.notes.map(n => n.title)).toEqual(['Stored']);
  });

  it('seeds the sample notes when storage is empty', async () => {
    const repo = createMemoryRepo();
    const store = createNotesStore(repo);
    await store.init();

    expect(store.count).toBeGreaterThan(0);
    // Seeding has to be written, not just shown, or it repeats every load.
    await expect(repo.list()).resolves.toHaveLength(store.count);
  });

  it('does not seed over notes that already exist', async () => {
    const store = createNotesStore(createMemoryRepo([note('The only one')]));
    await store.init();

    expect(store.count).toBe(1);
  });

  it('does not re-seed once the user has deleted everything', async () => {
    // Only tombstones left: the store is visibly empty but storage is not, and
    // re-seeding here would resurrect the sample notes the user just cleared.
    const store = createNotesStore(createMemoryRepo([deleteNote(note('Deleted'))]));
    await store.init();

    expect(store.count).toBe(0);
    expect(store.status).toBe('ready');
  });

  it('only does work once, however many components call it', async () => {
    const repo = createMemoryRepo([note('Stored')]);
    const spy = vi.spyOn(repo, 'list');
    const store = createNotesStore(repo);

    await Promise.all([store.init(), store.init()]);
    await store.init();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('reports an error rather than throwing when storage is unavailable', async () => {
    const repo = { ...createMemoryRepo(), list: () => Promise.reject(new Error('No IndexedDB')) };
    const store = createNotesStore(repo);

    await store.init();

    expect(store.status).toBe('error');
    expect(store.error).toBe('No IndexedDB');
    expect(store.notes).toEqual([]);
  });

  it('reports an error when the seed cannot be written', async () => {
    const store = createNotesStore(failingRepo('Quota exceeded'));

    await store.init();

    expect(store.status).toBe('error');
    expect(store.error).toBe('Quota exceeded');
  });
});

describe('the notes list', () => {
  it('hides tombstones', async () => {
    const store = createNotesStore(
      createMemoryRepo([note('Visible'), deleteNote(note('Deleted'))]),
    );
    await store.init();

    expect(store.notes.map(n => n.title)).toEqual(['Visible']);
    expect(store.count).toBe(1);
  });

  it('sorts newest first', async () => {
    const store = createNotesStore(
      createMemoryRepo([
        note('Oldest', '2024-01-01T00:00:00.000Z'),
        note('Newest', '2026-01-01T00:00:00.000Z'),
        note('Middle', '2025-01-01T00:00:00.000Z'),
      ]),
    );
    await store.init();

    expect(store.notes.map(n => n.title)).toEqual(['Newest', 'Middle', 'Oldest']);
  });
});

describe('add', () => {
  let repo: NotesRepo;
  let store: ReturnType<typeof createNotesStore>;

  beforeEach(async () => {
    repo = createMemoryRepo([note('Existing', '2020-01-01T00:00:00.000Z')]);
    store = createNotesStore(repo);
    await store.init();
  });

  it('puts the new note at the top of the list', async () => {
    await store.add({ title: 'Brand new', body: 'Body' });

    expect(store.notes[0].title).toBe('Brand new');
    expect(store.count).toBe(2);
  });

  it('persists it', async () => {
    const added = await store.add({ title: 'Brand new', body: 'Body' });

    await expect(repo.get(added.id)).resolves.toMatchObject({ title: 'Brand new' });
  });

  it('returns the created note', async () => {
    const added = await store.add({ title: 'Returned', body: 'Body' });

    expect(added.id).toBeTruthy();
    expect(added.deletedAt).toBeNull();
  });

  it('keeps markdown in the body untouched', async () => {
    const body = '## Heading\n\n- a\n- b';
    const added = await store.add({ title: 'Markdown', body });

    expect(added.body).toBe(body);
    await expect(repo.get(added.id)).resolves.toMatchObject({ body });
  });

  it('surfaces a write failure without losing what the user typed', async () => {
    const offline = createNotesStore(failingRepo('Disk full', [note('Existing')]));
    await offline.init();

    await offline.add({ title: 'Unsaved', body: 'Body' });

    expect(offline.error).toBe('Disk full');
    // The note stays on screen; dropping it would discard the user's work.
    expect(offline.notes.map(n => n.title)).toContain('Unsaved');
  });
});

describe('update', () => {
  let repo: NotesRepo;
  let store: ReturnType<typeof createNotesStore>;
  let existing: Note;

  beforeEach(async () => {
    existing = note('Before', '2020-01-01T00:00:00.000Z');
    repo = createMemoryRepo([existing]);
    store = createNotesStore(repo);
    await store.init();
  });

  it('changes the note in place', async () => {
    await store.update(existing.id, { title: 'After', body: 'New body' });

    expect(store.count).toBe(1);
    expect(store.notes[0]).toMatchObject({ id: existing.id, title: 'After', body: 'New body' });
  });

  it('persists the change', async () => {
    await store.update(existing.id, { title: 'After', body: 'New body' });

    await expect(repo.get(existing.id)).resolves.toMatchObject({ title: 'After' });
  });

  it('moves the edited note to the top', async () => {
    await store.add({ title: 'Newer', body: 'Body' });
    await store.update(existing.id, { title: 'Just edited', body: 'Body' });

    expect(store.notes[0].title).toBe('Just edited');
  });

  it('ignores an unknown id', async () => {
    await store.update('does-not-exist', { title: 'Nope', body: 'Body' });

    expect(store.count).toBe(1);
    expect(store.notes[0].title).toBe('Before');
  });

  it('does not resurrect a deleted note', async () => {
    await store.remove(existing.id);
    await store.update(existing.id, { title: 'Zombie', body: 'Body' });

    expect(store.count).toBe(0);
  });
});

describe('remove', () => {
  let repo: NotesRepo;
  let store: ReturnType<typeof createNotesStore>;
  let existing: Note;

  beforeEach(async () => {
    existing = note('Doomed');
    repo = createMemoryRepo([existing, note('Survivor')]);
    store = createNotesStore(repo);
    await store.init();
  });

  it('takes the note out of the list', async () => {
    await store.remove(existing.id);

    expect(store.notes.map(n => n.title)).toEqual(['Survivor']);
  });

  it('writes a tombstone rather than dropping the record', async () => {
    await store.remove(existing.id);

    // The row has to survive, or a future sync has no way to tell the other
    // device that the note was deleted rather than never created.
    const stored = await repo.get(existing.id);
    expect(stored).toBeDefined();
    expect(stored!.deletedAt).not.toBeNull();
  });

  it('ignores an unknown id', async () => {
    await store.remove('does-not-exist');

    expect(store.count).toBe(2);
  });

  it('is idempotent', async () => {
    await store.remove(existing.id);
    await store.remove(existing.id);

    expect(store.count).toBe(1);
  });

  it('surfaces a write failure', async () => {
    const offline = createNotesStore(failingRepo('Disk full', [existing]));
    await offline.init();

    await offline.remove(existing.id);

    expect(offline.error).toBe('Disk full');
  });
});

describe('a full session', () => {
  it('survives being reloaded from the same storage', async () => {
    const repo = createMemoryRepo();

    const first = createNotesStore(repo);
    await first.init();
    const seeded = first.count;
    const added = await first.add({ title: 'Written before reload', body: '**bold**' });
    await first.remove(first.notes.at(-1)!.id);

    // A second store over the same repo is what a page reload amounts to.
    const second = createNotesStore(repo);
    await second.init();

    expect(second.count).toBe(seeded);
    expect(second.notes.map(n => n.title)).toContain('Written before reload');
    expect(second.notes.find(n => n.id === added.id)!.body).toBe('**bold**');
  });
});
