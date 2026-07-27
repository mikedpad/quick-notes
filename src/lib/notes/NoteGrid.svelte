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

<!-- Auto-filling tracks rather than fixed breakpoints: the wall adapts to the
     space it is given, so it behaves the same wherever it is dropped. The row
     gap is the wider of the two, since notes rotate into the space beside them
     but drop into the space below. -->
<div class="wall">
  {#each notes as note, index (note.id)}
    <NoteCard {note} {index} {onedit} {ondelete} />
  {/each}
</div>

<style>
  .wall {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 36px 30px;
  }
</style>
