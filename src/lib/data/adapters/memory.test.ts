import { describe, expect, it } from 'vitest';
import { createMemoryRepo } from '$lib/data/adapters/memory';
import { describeRepoContract } from '$lib/data/repo.contract';
import { createNote } from '$lib/domain/note';

describeRepoContract('the memory adapter', async () => createMemoryRepo());

describe('the memory adapter’s seeding constructor', () => {
  it('accepts an initial set of notes', async () => {
    const notes = [
      createNote({ title: 'One', body: 'a' }),
      createNote({ title: 'Two', body: 'b' }),
    ];
    const repo = createMemoryRepo(notes);

    await expect(repo.list()).resolves.toHaveLength(2);
  });

  it('does not alias the array it was constructed with', async () => {
    const note = createNote({ title: 'Original', body: 'a' });
    const repo = createMemoryRepo([note]);

    note.title = 'Mutated after construction';

    await expect(repo.get(note.id)).resolves.toHaveProperty('title', 'Original');
  });

  it('gives each instance its own storage', async () => {
    const first = createMemoryRepo();
    const second = createMemoryRepo();

    await first.put(createNote({ title: 'Only in the first', body: 'a' }));

    await expect(second.list()).resolves.toEqual([]);
  });
});
