import { createRepo, type NotesRepo } from '$lib/data';
import { loadSeed } from '$lib/data/seed';
import {
  byNewest,
  createNote,
  deleteNote,
  editNote,
  isLive,
  type Note,
  type NoteDraft,
} from '$lib/domain/note';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * The reactive cache sitting in front of the repository.
 *
 * Components read `notes` and call the mutators; they never touch storage. Writes
 * are applied to local state first and persisted after, so the UI stays
 * responsive and the repo stays the source of truth on next load.
 */
class NotesStore {
  #repo: NotesRepo;
  #records = $state<Note[]>([]);

  status = $state<LoadStatus>('idle');
  error = $state<string | null>(null);

  /** Live notes, newest first. Tombstones are held in `#records` but never shown. */
  notes = $derived(this.#records.filter(isLive).sort(byNewest));
  count = $derived(this.notes.length);

  constructor(repo: NotesRepo) {
    this.#repo = repo;
  }

  /** Safe to call from every mount; only the first call does work. */
  async init(): Promise<void> {
    if (this.status !== 'idle') return;
    this.status = 'loading';

    try {
      let stored = await this.#repo.list();

      // First run: nothing has ever been written, so plant the sample notes.
      if (stored.length === 0) {
        stored = loadSeed();
        await this.#repo.putMany(stored);
      }

      this.#records = stored;
      this.status = 'ready';
    } catch (cause) {
      this.error = cause instanceof Error ? cause.message : 'Could not load notes.';
      this.status = 'error';
    }
  }

  async add(draft: NoteDraft): Promise<Note> {
    const note = createNote(draft);
    this.#records = [...this.#records, note];
    await this.#persist(note);
    return note;
  }

  async update(id: string, draft: NoteDraft): Promise<void> {
    const existing = this.#records.find(note => note.id === id);
    if (!existing) return;
    await this.#replace(editNote(existing, draft));
  }

  async remove(id: string): Promise<void> {
    const existing = this.#records.find(note => note.id === id);
    if (!existing) return;
    await this.#replace(deleteNote(existing));
  }

  async #replace(note: Note): Promise<void> {
    this.#records = this.#records.map(current => (current.id === note.id ? note : current));
    await this.#persist(note);
  }

  async #persist(note: Note): Promise<void> {
    try {
      await this.#repo.put(note);
    } catch (cause) {
      this.error = cause instanceof Error ? cause.message : 'Could not save note.';
    }
  }
}

/** Exposed so tests can inject a memory repo instead of IndexedDB. */
export const createNotesStore = (repo: NotesRepo = createRepo()) => new NotesStore(repo);

export const notes = createNotesStore();
