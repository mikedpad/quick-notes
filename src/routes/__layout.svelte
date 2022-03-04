<script lang="ts">
  import AddNote from '$lib/AddNote.svelte';
  import Header from '$lib/Header.svelte';
  import '../styles/app.css';
</script>

<Header />
<main>
  <slot />
</main>
<AddNote />

<style>
  main {
    padding: 0;
    margin: 0;
  }
</style>
