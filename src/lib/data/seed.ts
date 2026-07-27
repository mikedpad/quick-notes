import { PAPER_COUNT, type Note } from '$lib/domain/note';
import seedNotes from './seed.json';

/**
 * The faker-generated sample set, used only to populate an empty store on first
 * run so the app has something to show. Once a user has their own notes this is
 * never read again.
 *
 * The JSON keeps the generator's own shape (`content` as a paragraph array) and
 * is adapted here, so `src/dev/generateData.ts` stays decoupled from the
 * storage schema.
 *
 * Papers are dealt out round-robin and stored, rather than left to the wall to
 * work out from position: a seeded note then keeps its colour when notes are
 * added above it.
 */
export function loadSeed(): Note[] {
  return seedNotes.map((note, index) => ({
    id: note.id,
    title: note.title,
    body: note.content.join('\n\n'),
    color: index % PAPER_COUNT,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    deletedAt: null,
    syncedAt: null,
  }));
}
