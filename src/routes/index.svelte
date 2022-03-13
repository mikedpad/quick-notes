<script lang="ts">
  import { dev } from '$app/env';
  import { notes } from '$data/noteStore';
  import Note from '$lib/Note.svelte';
  import json from '$data/notes.json';
  import AddNote from '$lib/AddNote.svelte';

  if (dev) {
    notes.set(
      json.map(n => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      })),
    );
  }
</script>

<svelte:head>
  <title>Quick Notes</title>
</svelte:head>

<div class="grid">
  {#each $notes as { id, title, content, createdAt, updatedAt }}
    <Note {id} {title} {content} {createdAt} {updatedAt} />
  {/each}
</div>
<AddNote />

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
