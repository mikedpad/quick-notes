import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const modalOpen: Writable<boolean> = writable(false);
