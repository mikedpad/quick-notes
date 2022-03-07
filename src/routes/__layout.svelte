<script lang="ts">
  import AddNote from '$lib/AddNote.svelte';
  import '../styles/app.css';
</script>

<header>
  <h1>Quick Notes</h1>
</header>
<main>
  <slot />
</main>

<style>
  header {
    background-color: var(--header-bg-color);
    color: var(--header-fg-color);
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 30%);
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    position: sticky;
    top: 0;
  }
  h1 {
    display: block;
    margin: 0.35em 0.5em 0.35em;
  }
  main {
    padding: 0;
    margin: 0;
  }
</style>
