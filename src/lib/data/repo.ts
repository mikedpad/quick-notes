import type { Note } from '$lib/domain/note';

/**
 * The single boundary between the application and wherever notes are stored.
 *
 * Nothing above this line knows whether notes live in memory, IndexedDB, or
 * someday a remote server. Adding a backend means adding an adapter, not
 * touching state or components.
 *
 * `put` is an upsert rather than separate create/update calls: it is the same
 * operation a sync merge performs, so one method covers both.
 */
export interface NotesRepo {
  /** Every record, including tombstones. Filtering is the caller's business. */
  list(): Promise<Note[]>;
  get(id: string): Promise<Note | undefined>;
  put(note: Note): Promise<void>;
  putMany(notes: Note[]): Promise<void>;
  /** Hard delete. Ordinary deletion is a tombstone written via `put`. */
  purge(id: string): Promise<void>;
  clear(): Promise<void>;
}
