import type { Note } from '$types/types';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const notes: Writable<Note[]> = writable([]);
export function addNote(note: Note) {
  notes.update(notes => [...notes, note]);
}

export const modalOpen: Writable<boolean> = writable(false);
