<script lang="ts">
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import Plus from '@lucide/svelte/icons/plus';
  import StickyNote from '@lucide/svelte/icons/sticky-note';
  import NoteEditor from '$lib/notes/NoteEditor.svelte';
  import NoteGrid from '$lib/notes/NoteGrid.svelte';
  import ConfirmDialog from '$lib/ui/ConfirmDialog.svelte';
  import { notes } from '$lib/state/notes.svelte';
  import { toDraft, type Note, type NoteDraft } from '$lib/domain/note';

  // The store loads from IndexedDB, which only exists in the browser; $effect
  // never runs during prerender, so this is the right place to kick it off.
  $effect(() => {
    notes.init();
  });

  let editorOpen = $state(false);
  let editing = $state<Note | null>(null);

  let confirmingDelete = $state(false);
  let pendingDelete = $state<Note | null>(null);

  const editorTitle = $derived(editing ? 'Edit note' : 'New note');
  const submitLabel = $derived(editing ? 'Save changes' : 'Add note');
  const draft = $derived(editing ? toDraft(editing) : undefined);

  function startNewNote() {
    editing = null;
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
  <div class="card preset-tonal-error flex items-start gap-3 p-4" role="alert">
    <CircleAlert size={20} class="shrink-0" aria-hidden="true" />
    <div>
      <p class="font-bold">Your notes could not be loaded.</p>
      <p class="text-sm">{notes.error}</p>
    </div>
  </div>
{:else if notes.status === 'ready' && notes.count === 0}
  <div class="flex flex-col items-center gap-4 py-20 text-center">
    <StickyNote size={40} class="text-surface-500" aria-hidden="true" />
    <div>
      <p class="h6 font-bold">No notes yet</p>
      <p class="text-surface-600-400 text-sm">Your first note is one click away.</p>
    </div>
    <button type="button" class="btn preset-filled-primary-500 gap-2" onclick={startNewNote}>
      <Plus size={18} aria-hidden="true" /> New note
    </button>
  </div>
{:else}
  <NoteGrid notes={notes.notes} onedit={startEditing} ondelete={requestDelete} />
{/if}

<button
  type="button"
  class="btn-icon btn-icon-lg preset-filled-primary-500 fixed right-6 bottom-6 shadow-xl"
  aria-label="New note"
  title="New note"
  onclick={startNewNote}
>
  <Plus size={22} aria-hidden="true" />
</button>

<NoteEditor bind:open={editorOpen} {draft} title={editorTitle} {submitLabel} onsubmit={save} />

<ConfirmDialog
  bind:open={confirmingDelete}
  title="Delete note?"
  message={pendingDelete ? `“${pendingDelete.title}” will be removed from your notes.` : ''}
  confirmLabel="Delete"
  destructive
  onconfirm={confirmDelete}
/>
