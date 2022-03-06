// Types
import type { Note } from 'src/types/note';
import type { Writable } from 'svelte/store';

// Imports
import { writable } from 'svelte/store';

// Note
export const notes: Writable<Note[]> = writable([]);
export function addNote(note: Note) {
  notes.update(notes => [...notes, note]);
}
export function removeNote(id: string) {
  notes.update(notes => notes.filter(n => n.id !== id));
}

// State
export const modalOpen: Writable<boolean> = writable(false);
