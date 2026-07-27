<script lang="ts">
  import Plus from '@lucide/svelte/icons/plus';
  import NoteEditor from '$lib/notes/NoteEditor.svelte';
  import NoteGrid from '$lib/notes/NoteGrid.svelte';
  import ConfirmDialog from '$lib/ui/ConfirmDialog.svelte';
  import { notes } from '$lib/state/notes.svelte';
  import { EMPTY_DRAFT, PAPER_COUNT, toDraft, type Note, type NoteDraft } from '$lib/domain/note';

  // The store loads from IndexedDB, which only exists in the browser; $effect
  // never runs during prerender, so this is the right place to kick it off.
  $effect(() => {
    notes.init();
  });

  let editorOpen = $state(false);
  let editing = $state<Note | null>(null);
  /** The paper a new note starts on — a different one each time, like a real pad. */
  let freshPaper = $state(0);

  let confirmingDelete = $state(false);
  let pendingDelete = $state<Note | null>(null);

  const draft = $derived.by<NoteDraft>(() => {
    const note = editing;
    if (!note) return { ...EMPTY_DRAFT, color: freshPaper };

    // An older note has no colour of its own: the wall works one out from where
    // the note hangs, and the editor has to open on that same paper.
    const position = notes.notes.findIndex(current => current.id === note.id);
    return toDraft(note, Math.max(position, 0));
  });

  function startNewNote() {
    editing = null;
    freshPaper = Math.floor(Math.random() * PAPER_COUNT);
    editorOpen = true;
  }

  function startEditing(note: Note) {
    editing = note;
    editorOpen = true;
  }

  function requestDelete(note: Note) {
    pendingDelete = note;
    confirmingDelete = true;
  }

  async function save(values: NoteDraft) {
    if (editing) await notes.update(editing.id, values);
    else await notes.add(values);
  }

  async function confirmDelete() {
    if (pendingDelete) await notes.remove(pendingDelete.id);
    pendingDelete = null;
  }
</script>

<svelte:head>
  <title>Quick Notes</title>
</svelte:head>

{#if notes.status === 'error'}
  <div class="notice" role="alert">
    <p class="headline">Your notes could not be taken down off the wall.</p>
    <p class="detail">{notes.error}</p>
  </div>
{:else if notes.status === 'ready' && notes.count === 0}
  <div class="empty">
    <div class="sticky">
      <p class="headline">Nothing here yet!</p>
      <p class="detail">Stick your first note up with the + pad in the corner.</p>
    </div>
  </div>
{:else}
  <NoteGrid notes={notes.notes} onedit={startEditing} ondelete={requestDelete} />
{/if}

<!-- A pad of notes with a pen mark on the top sheet. -->
<button type="button" class="pad" aria-label="New note" title="New note" onclick={startNewNote}>
  <span class="top">
    <Plus size={26} strokeWidth={2.4} aria-hidden="true" />
  </span>
</button>

<NoteEditor bind:open={editorOpen} {draft} editing={editing !== null} onsubmit={save} />

<ConfirmDialog
  bind:open={confirmingDelete}
  title="Take this note down?"
  message={pendingDelete ? `“${pendingDelete.title}” will be peeled off the wall for good.` : ''}
  confirmLabel="Delete"
  cancelLabel="Keep it"
  destructive
  onconfirm={confirmDelete}
/>

<style>
  .empty {
    display: flex;
    justify-content: center;
    padding: 80px 0;
  }

  .sticky,
  .notice {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    padding: 20px;
    color: var(--color-ink);
    box-shadow:
      0 1px 2px rgb(0 0 0 / 0.08),
      0 12px 20px -8px rgb(0 0 0 / 0.35);
  }

  .sticky {
    width: 240px;
    height: 240px;
    transform: rotate(-2deg);
    background: linear-gradient(
      178deg,
      oklch(0.96 0.1 102) 0%,
      oklch(0.93 0.115 102) 26%,
      oklch(0.93 0.115 102) 78%,
      oklch(0.87 0.12 100) 100%
    );
  }

  /* Bad news goes up on a pink one, same as a delete. */
  .notice {
    width: min(24rem, 100%);
    margin: 40px auto 0;
    transform: rotate(1deg);
    background: linear-gradient(
      178deg,
      oklch(0.91 0.08 356) 0%,
      oklch(0.88 0.09 356) 26%,
      oklch(0.83 0.1 354) 100%
    );
  }

  .headline {
    margin: 0;
    font-family: var(--font-hand);
    font-weight: 700;
    font-size: 28px;
    line-height: 1.05;
  }

  .detail {
    margin: 0;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.45;
  }

  /**
   * Not a button so much as a pad of notes: two sheets fanned out behind the
   * top one, which is the only one that is really there.
   *
   * The rotation makes the button its own stacking context, and inside one of
   * those a negative z-index still cannot get underneath the element's own
   * background — so the top sheet is a layer of its own rather than the
   * button's background, and the fanned ones sit below it.
   */
  .pad {
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 60px;
    height: 60px;
    padding: 0;
    border: 0;
    background: none;
    transform: rotate(3deg);
    color: var(--color-ink);
    cursor: pointer;
    transition: transform 0.15s ease;
    z-index: 40;
  }

  .pad::before,
  .pad::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.12);
  }

  .pad::before {
    background: oklch(0.88 0.09 356);
    transform: rotate(-7deg);
  }

  .pad::after {
    background: oklch(0.92 0.09 152);
    transform: rotate(5deg);
  }

  .top {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      178deg,
      oklch(0.96 0.1 102) 0%,
      oklch(0.93 0.115 102) 30%,
      oklch(0.88 0.12 100) 100%
    );
    box-shadow:
      0 2px 4px rgb(0 0 0 / 0.15),
      0 12px 18px -8px rgb(0 0 0 / 0.4);
  }

  .pad:hover {
    transform: rotate(0deg) scale(1.06);
  }

  .pad:focus-visible {
    outline: 2px solid var(--color-ink);
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    .pad {
      transition: none;
    }
  }
</style>
