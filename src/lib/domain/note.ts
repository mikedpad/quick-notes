/**
 * The Note domain model.
 *
 * Pure: no I/O, no Svelte, no browser APIs. Everything here is a plain function
 * over plain data, so it can be unit tested without a DOM or a database.
 */

export type Note = {
  /** Client-generated. Never server-assigned, so notes can be created offline. */
  id: string;
  title: string;
  /** Markdown source. Stored as written; rendered to HTML only at display time. */
  body: string;
  /** ISO 8601. Stored as strings so JSON, IndexedDB and HTTP all agree. */
  createdAt: string;
  /** ISO 8601. Doubles as the last-write-wins clock if sync is ever added. */
  updatedAt: string;
  /** Tombstone. A deletion that leaves no trace cannot be synced. */
  deletedAt: string | null;
  /** ISO 8601, or null when the note has local changes not yet pushed. */
  syncedAt: string | null;
};

/** The user-editable subset of a note — what a form produces. */
export type NoteDraft = {
  title: string;
  body: string;
};

export const EMPTY_DRAFT: NoteDraft = { title: '', body: '' };

const now = () => new Date().toISOString();

/**
 * `crypto.randomUUID` is available in every browser target and in Node 19+,
 * which spares us a nanoid dependency for the one thing it was used for.
 */
const newId = () => crypto.randomUUID();

export function createNote(draft: NoteDraft): Note {
  const timestamp = now();
  return {
    id: newId(),
    title: draft.title.trim(),
    body: draft.body.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
    syncedAt: null,
  };
}

export function editNote(note: Note, draft: NoteDraft): Note {
  return {
    ...note,
    title: draft.title.trim(),
    body: draft.body.trim(),
    updatedAt: now(),
    syncedAt: null,
  };
}

/** Soft delete. The record stays so the deletion itself is a syncable fact. */
export function deleteNote(note: Note): Note {
  const timestamp = now();
  return { ...note, deletedAt: timestamp, updatedAt: timestamp, syncedAt: null };
}

export const isLive = (note: Note): boolean => note.deletedAt === null;

export const toDraft = (note: Note): NoteDraft => ({ title: note.title, body: note.body });

/** Newest first. */
export const byNewest = (a: Note, b: Note): number => b.updatedAt.localeCompare(a.updatedAt);

export type ValidationErrors = Partial<Record<keyof NoteDraft, string>>;

/**
 * Kept deliberately close to what the browser's own constraint validation
 * enforces, so the form and the write path agree on what a valid note is.
 */
export function validateDraft(draft: NoteDraft): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!draft.title.trim()) errors.title = 'Title is required.';
  if (!draft.body.trim()) errors.body = 'Contents is required.';
  return errors;
}

export const isValid = (draft: NoteDraft): boolean =>
  Object.keys(validateDraft(draft)).length === 0;
