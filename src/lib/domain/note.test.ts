import { describe, expect, it, vi } from 'vitest';
import {
  EMPTY_DRAFT,
  PAPER_COUNT,
  byNewest,
  createNote,
  deleteNote,
  editNote,
  isLive,
  isValid,
  paperIndex,
  toDraft,
  validateDraft,
  type Note,
} from '$lib/domain/note';

const draft = (title = 'A title', body = 'A body') => ({ title, body });

describe('createNote', () => {
  it('produces a note from a draft', () => {
    const note = createNote(draft('Shopping', 'Milk, eggs'));

    expect(note.title).toBe('Shopping');
    expect(note.body).toBe('Milk, eggs');
  });

  it('assigns a unique id without needing a server', () => {
    const ids = new Set(Array.from({ length: 100 }, () => createNote(draft()).id));

    expect(ids.size).toBe(100);
  });

  it('trims surrounding whitespace', () => {
    const note = createNote(draft('  Padded  ', '\n  Body  \n'));

    expect(note.title).toBe('Padded');
    expect(note.body).toBe('Body');
  });

  it('preserves markdown inside the body', () => {
    const source = '# Heading\n\n- one\n- two\n\n`code`';
    expect(createNote(draft('Markdown', source)).body).toBe(source);
  });

  it('stamps createdAt and updatedAt identically, as ISO strings', () => {
    const note = createNote(draft());

    expect(note.createdAt).toBe(note.updatedAt);
    expect(note.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
  });

  it('starts alive and unsynced', () => {
    const note = createNote(draft());

    expect(note.deletedAt).toBeNull();
    expect(note.syncedAt).toBeNull();
  });
});

describe('editNote', () => {
  it('applies the new title and body', () => {
    const note = createNote(draft('Before', 'Old body'));
    const edited = editNote(note, draft('After', 'New body'));

    expect(edited.title).toBe('After');
    expect(edited.body).toBe('New body');
  });

  it('keeps the id and createdAt', () => {
    const note = createNote(draft());
    const edited = editNote(note, draft('Changed'));

    expect(edited.id).toBe(note.id);
    expect(edited.createdAt).toBe(note.createdAt);
  });

  it('advances updatedAt', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
      const note = createNote(draft());

      vi.setSystemTime(new Date('2026-01-02T00:00:00.000Z'));
      const edited = editNote(note, draft('Changed'));

      expect(edited.updatedAt).toBe('2026-01-02T00:00:00.000Z');
      expect(edited.updatedAt > note.updatedAt).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('clears syncedAt, so the edit is picked up as pending', () => {
    const synced: Note = { ...createNote(draft()), syncedAt: '2026-01-01T00:00:00.000Z' };

    expect(editNote(synced, draft('Changed')).syncedAt).toBeNull();
  });

  it('does not mutate the note it was given', () => {
    const note = createNote(draft('Original'));
    editNote(note, draft('Changed'));

    expect(note.title).toBe('Original');
  });
});

describe('deleteNote', () => {
  it('writes a tombstone instead of discarding the record', () => {
    const note = createNote(draft());
    const deleted = deleteNote(note);

    expect(deleted.id).toBe(note.id);
    expect(deleted.title).toBe(note.title);
    expect(deleted.deletedAt).not.toBeNull();
  });

  it('touches updatedAt so the deletion wins a last-write-wins merge', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
      const note = createNote(draft());

      vi.setSystemTime(new Date('2026-06-01T00:00:00.000Z'));
      const deleted = deleteNote(note);

      expect(deleted.updatedAt).toBe(deleted.deletedAt);
      expect(deleted.updatedAt > note.updatedAt).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('clears syncedAt so the deletion is pushed', () => {
    const synced: Note = { ...createNote(draft()), syncedAt: '2026-01-01T00:00:00.000Z' };

    expect(deleteNote(synced).syncedAt).toBeNull();
  });

  it('does not mutate the note it was given', () => {
    const note = createNote(draft());
    deleteNote(note);

    expect(note.deletedAt).toBeNull();
  });
});

describe('colour', () => {
  it('keeps the paper the draft was written on', () => {
    expect(createNote({ ...draft(), color: 3 }).color).toBe(3);
  });

  it('leaves a note that never picked one without a colour', () => {
    expect(createNote(draft()).color).toBeUndefined();
  });

  it('changes paper on edit', () => {
    const note = createNote({ ...draft(), color: 1 });

    expect(editNote(note, { ...draft('Changed'), color: 4 }).color).toBe(4);
  });

  it('leaves the note on its own paper when the draft says nothing', () => {
    const note = createNote({ ...draft(), color: 1 });

    expect(editNote(note, draft('Changed')).color).toBe(1);
  });
});

describe('paperIndex', () => {
  it('uses the note’s own colour wherever it hangs', () => {
    const note = { ...createNote(draft()), color: 4 };

    expect(paperIndex(note, 0)).toBe(4);
    expect(paperIndex(note, 12)).toBe(4);
  });

  it('falls back to position for a note stored before colours existed', () => {
    const legacy = createNote(draft());

    expect(paperIndex(legacy, 0)).toBe(0);
    expect(paperIndex(legacy, 6)).toBe(1);
  });

  it('cycles the fallback through every paper, so neighbours differ', () => {
    const legacy = createNote(draft());
    const walk = Array.from({ length: PAPER_COUNT * 2 }, (_, i) => paperIndex(legacy, i));

    expect(walk).toEqual([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
  });

  it('keeps a deliberate colour of zero rather than treating it as missing', () => {
    const note = { ...createNote(draft()), color: 0 };

    expect(paperIndex(note, 3)).toBe(0);
  });
});

describe('isLive', () => {
  it('accepts a note with no tombstone', () => {
    expect(isLive(createNote(draft()))).toBe(true);
  });

  it('rejects a tombstoned note', () => {
    expect(isLive(deleteNote(createNote(draft())))).toBe(false);
  });
});

describe('toDraft', () => {
  it('round-trips through createNote unchanged', () => {
    const original = { ...draft('Title', 'Body'), color: 3 };
    const note = createNote(original);

    expect(toDraft(note)).toEqual(original);
  });

  it('exposes only the editable fields', () => {
    expect(Object.keys(toDraft(createNote(draft()))).sort()).toEqual(['body', 'color', 'title']);
  });

  it('resolves the paper of a note that has none, so the editor opens on it', () => {
    const legacy = createNote(draft());

    expect(toDraft(legacy, 7).color).toBe(2);
  });
});

describe('byNewest', () => {
  const at = (updatedAt: string): Note => ({ ...createNote(draft()), updatedAt });

  it('sorts most recently updated first', () => {
    const older = at('2026-01-01T00:00:00.000Z');
    const newer = at('2026-02-01T00:00:00.000Z');

    expect([older, newer].sort(byNewest)).toEqual([newer, older]);
  });

  it('treats equal timestamps as equal', () => {
    const stamp = '2026-01-01T00:00:00.000Z';

    expect(byNewest(at(stamp), at(stamp))).toBe(0);
  });

  it('orders correctly across a year boundary', () => {
    const notes = [
      at('2025-12-31T23:59:59.000Z'),
      at('2026-01-01T00:00:00.000Z'),
      at('2024-06-15T12:00:00.000Z'),
    ];

    expect(notes.sort(byNewest).map(n => n.updatedAt)).toEqual([
      '2026-01-01T00:00:00.000Z',
      '2025-12-31T23:59:59.000Z',
      '2024-06-15T12:00:00.000Z',
    ]);
  });
});

describe('validateDraft', () => {
  it('accepts a complete draft', () => {
    expect(validateDraft(draft())).toEqual({});
    expect(isValid(draft())).toBe(true);
  });

  it('rejects a missing title', () => {
    expect(validateDraft(draft('', 'body'))).toHaveProperty('title');
  });

  it('rejects a missing body', () => {
    expect(validateDraft(draft('title', ''))).toHaveProperty('body');
  });

  it('rejects whitespace-only values, which look filled but are not', () => {
    const errors = validateDraft({ title: '   ', body: '\n\t ' });

    expect(errors).toHaveProperty('title');
    expect(errors).toHaveProperty('body');
    expect(isValid({ title: '   ', body: '\n\t ' })).toBe(false);
  });

  it('reports every problem at once rather than one at a time', () => {
    expect(Object.keys(validateDraft(EMPTY_DRAFT)).sort()).toEqual(['body', 'title']);
  });
});

describe('EMPTY_DRAFT', () => {
  it('is blank and therefore invalid', () => {
    expect(EMPTY_DRAFT).toEqual({ title: '', body: '' });
    expect(isValid(EMPTY_DRAFT)).toBe(false);
  });
});
