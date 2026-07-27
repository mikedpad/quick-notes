import type { Note } from '$lib/domain/note';
import seedNotes from './seed.json';

/**
 * The faker-generated sample set, used only to populate an empty store on first
 * run so the app has something to show. Once a user has their own notes this is
 * never read again.
 *
 * The JSON keeps the generator's own shape (`content` as a paragraph array) and
 * is adapted here, so `src/dev/generateData.ts` stays decoupled from the
 * storage schema.
 */
export function loadSeed(): Note[] {
  return seedNotes.map(note => ({
    id: note.id,
    title: note.title,
    body: note.content.join('\n\n'),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    deletedAt: null,
    syncedAt: null,
  }));
}
