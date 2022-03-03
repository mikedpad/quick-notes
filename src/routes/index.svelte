<script lang="ts">
  import Note from '$lib/Note.svelte';
  import { createNote } from '$lib/generateData';
  import { notes } from '$data/store';

  $notes = Array.from({ length: 15 }).map(_ => createNote());
</script>

<svelte:head>
  <title>Quick Notes</title>
</svelte:head>

<div class="grid">
  {#each $notes as { id, title, content }}
    <Note {id} {title} {content} />
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, var(--note-width));
    gap: 2rem;
    justify-content: center;
    margin: 2rem auto;
    padding: 0;
  }
</style>
