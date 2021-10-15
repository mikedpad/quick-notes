<script lang="ts">
  import { generateNote } from '$lib/generateData';
  import { notes } from '$data/notes';
  import Note from '$lib/Note.svelte';

  $notes = Array.from({ length: 15 }).map(_ => generateNote());
</script>

<div class="grid">
  {#each $notes as { id, title, content }}
    <Note {id} {title} {content} />
  {/each}
</div>

<style lang="scss">
  .grid {
    gap: 1rem;
    margin: 2rem auto;
    display: grid;
    grid-template-rows: repeat(auto-fill, minmax(15rem, 1fr));
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  }
</style>
