<script lang="ts">
  import NoteCard from '$lib/notes/NoteCard.svelte';
  import type { Note } from '$lib/domain/note';

  type Props = {
    notes: Note[];
    onedit?: (note: Note) => void;
    ondelete?: (note: Note) => void;
  };

  let { notes, onedit, ondelete }: Props = $props();
</script>

<!-- Auto-filling tracks rather than fixed breakpoints: the grid adapts to the
     space it is given, so it behaves the same wherever it is dropped. -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
  {#each notes as note (note.id)}
    <NoteCard {note} {onedit} {ondelete} />
  {/each}
</div>
