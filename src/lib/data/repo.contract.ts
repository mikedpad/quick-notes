import { beforeEach, describe, expect, it } from 'vitest';
import { createNote, deleteNote, type Note } from '$lib/domain/note';
import type { NotesRepo } from '$lib/data/repo';

/**
 * The behaviour every `NotesRepo` must exhibit, written once and run against
 * every adapter.
 *
 * This exists because the memory adapter stands in for IndexedDB during
 * prerender and throughout the rest of the test suite. If the two ever diverge,
 * tests pass against a fiction. Anything asserted here is a promise the
 * interface makes, so a future adapter (a sync-backed one, say) can be proven
 * correct by adding a single line rather than a new suite.
 */
export function describeRepoContract(name: string, open: () => Promise<NotesRepo>): void {
  describe(`${name} satisfies the NotesRepo contract`, () => {
    let repo: NotesRepo;

    const note = (title: string, body = 'Body text.'): Note => createNote({ title, body });

    beforeEach(async () => {
      repo = await open();
      await repo.clear();
    });

    it('starts empty', async () => {
      await expect(repo.list()).resolves.toEqual([]);
    });

    it('round-trips every field of a note', async () => {
      const original = note('Round trip');
      await repo.put(original);

      // Deep equality matters: IndexedDB structured-clones, and a field that
      // fails to survive that (a Date, a function, undefined vs null) would
      // silently disappear between sessions.
      await expect(repo.get(original.id)).resolves.toEqual(original);
    });

    it('preserves null timestamps rather than dropping the keys', async () => {
      const original = note('Never synced');
      await repo.put(original);

      const stored = await repo.get(original.id);
      expect(stored).toHaveProperty('deletedAt', null);
      expect(stored).toHaveProperty('syncedAt', null);
    });

    it('returns undefined for an unknown id', async () => {
      await expect(repo.get('does-not-exist')).resolves.toBeUndefined();
    });

    it('lists every stored record', async () => {
      const notes = [note('One'), note('Two'), note('Three')];
      await repo.putMany(notes);

      const listed = await repo.list();
      expect(listed).toHaveLength(3);
      expect(listed.map(n => n.title).sort()).toEqual(['One', 'Three', 'Two']);
    });

    it('upserts on put rather than duplicating', async () => {
      const original = note('Original title');
      await repo.put(original);
      await repo.put({ ...original, title: 'Replaced title' });

      const listed = await repo.list();
      expect(listed).toHaveLength(1);
      expect(listed[0].title).toBe('Replaced title');
    });

    it('treats putMany of an empty array as a no-op', async () => {
      await repo.put(note('Survivor'));
      await repo.putMany([]);

      await expect(repo.list()).resolves.toHaveLength(1);
    });

    it('retains tombstones — filtering live notes is the caller’s job', async () => {
      const original = note('Doomed');
      await repo.put(original);
      await repo.put(deleteNote(original));

      const listed = await repo.list();
      expect(listed).toHaveLength(1);
      expect(listed[0].deletedAt).not.toBeNull();
    });

    it('hard-deletes on purge', async () => {
      const kept = note('Kept');
      const purged = note('Purged');
      await repo.putMany([kept, purged]);

      await repo.purge(purged.id);

      await expect(repo.get(purged.id)).resolves.toBeUndefined();
      await expect(repo.list()).resolves.toHaveLength(1);
    });

    it('ignores a purge of an unknown id', async () => {
      await expect(repo.purge('does-not-exist')).resolves.toBeUndefined();
    });

    it('empties the store on clear', async () => {
      await repo.putMany([note('One'), note('Two')]);
      await repo.clear();

      await expect(repo.list()).resolves.toEqual([]);
    });

    it('hands out records the caller cannot use to corrupt the store', async () => {
      const original = note('Immutable');
      await repo.put(original);

      const first = await repo.get(original.id);
      first!.title = 'Mutated behind the repo’s back';

      // IndexedDB gets this for free by structured-cloning. The memory adapter
      // has to clone deliberately, or it would hand out live references and
      // behave unlike the thing it stands in for.
      await expect(repo.get(original.id)).resolves.toHaveProperty('title', 'Immutable');
    });

    it('does not let a stored note be mutated by the object that was written', async () => {
      const original = note('Written once');
      await repo.put(original);
      original.title = 'Changed after writing';

      await expect(repo.get(original.id)).resolves.toHaveProperty('title', 'Written once');
    });
  });
}
