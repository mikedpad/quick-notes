<script lang="ts">
  import AddNote from '$lib/AddNote.svelte';
</script>

<svelte:head>
  <title>Quick Notes</title>
</svelte:head>

<div class="grid" />
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
