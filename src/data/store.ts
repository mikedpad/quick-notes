import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const notes: Writable<Note[]> = writable([]);
export const navOpen: Writable<boolean> = writable(false);
export const modalOpen: Writable<boolean> = writable(false);
