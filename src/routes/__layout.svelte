<script lang="ts">
  import Header from '$lib/Header.svelte';
  import '../styles/app.css';
</script>

<Header />
<main>
  <slot />
</main>

<style>
  main {
    padding: 0;
    margin: 0;
  }
</style>
