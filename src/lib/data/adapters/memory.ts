import type { Note } from '$lib/domain/note';
import type { NotesRepo } from '$lib/data/repo';

/**
 * In-memory adapter. Used during prerender/SSR, where IndexedDB does not exist,
 * and in tests, where it makes storage assertions hermetic.
 *
 * Every note is cloned on the way in and on the way out. IndexedDB gets that
 * behaviour for free by structured-cloning across the storage boundary; without
 * it this adapter would hand out live references and quietly behave unlike the
 * thing it stands in for. See `repo.contract.ts`, which holds both to it.
 */
export function createMemoryRepo(initial: Note[] = []): NotesRepo {
  const notes = new Map<string, Note>(initial.map(note => [note.id, structuredClone(note)]));

  const save = (note: Note) => notes.set(note.id, structuredClone(note));

  return {
    async list() {
      return [...notes.values()].map(note => structuredClone(note));
    },
    async get(id) {
      const note = notes.get(id);
      return note && structuredClone(note);
    },
    async put(note) {
      save(note);
    },
    async putMany(incoming) {
      for (const note of incoming) save(note);
    },
    async purge(id) {
      notes.delete(id);
    },
    async clear() {
      notes.clear();
    },
  };
}
