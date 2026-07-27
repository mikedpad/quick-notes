import type { Note } from '$lib/domain/note';
import type { NotesRepo } from '$lib/data/repo';

/**
 * IndexedDB adapter, written against the native API.
 *
 * The event-based API is wrapped once at the top of this file so the repository
 * methods below read as ordinary async code. Nothing outside this module deals
 * with requests, transactions, or upgrade events.
 */

const DB_NAME = 'quick-notes';
const DB_VERSION = 1;
const STORE = 'notes';

/** Resolve when a request succeeds, reject with its error otherwise. */
function fromRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

/**
 * Resolve when a transaction commits. Writes await this rather than the
 * individual requests, because a request can succeed and still be rolled back.
 */
function fromTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

let connection: Promise<IDBDatabase> | undefined;

/**
 * Schema changes are added here as further `if (oldVersion < n)` blocks, which
 * is what keeps DB_VERSION meaningful. `onupgradeneeded` runs inside its own
 * versionchange transaction, so no awaiting is possible within it.
 */
function connect(): Promise<IDBDatabase> {
  connection ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = ({ oldVersion }) => {
      const db = request.result;
      if (oldVersion < 1) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        // Supports newest-first listing and `updatedAt > lastPulledAt` sync pulls.
        store.createIndex('by-updatedAt', 'updatedAt');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB'));
    request.onblocked = () => reject(new Error('IndexedDB upgrade blocked by another open tab'));
  });

  return connection;
}

async function readStore(): Promise<IDBObjectStore> {
  return (await connect()).transaction(STORE, 'readonly').objectStore(STORE);
}

async function write(run: (store: IDBObjectStore) => void): Promise<void> {
  const tx = (await connect()).transaction(STORE, 'readwrite');
  run(tx.objectStore(STORE));
  await fromTransaction(tx);
}

export function createIndexedDbRepo(): NotesRepo {
  return {
    async list() {
      return fromRequest((await readStore()).getAll() as IDBRequest<Note[]>);
    },

    async get(id) {
      return fromRequest((await readStore()).get(id) as IDBRequest<Note | undefined>);
    },

    async put(note) {
      await write(store => store.put(note));
    },

    async putMany(notes) {
      // One transaction for the whole batch: all of it lands, or none of it does.
      await write(store => notes.forEach(note => store.put(note)));
    },

    async purge(id) {
      await write(store => store.delete(id));
    },

    async clear() {
      await write(store => store.clear());
    },
  };
}
