<script lang="ts">
  import { slide } from 'svelte/transition';
  const generateNotes = () => console.log(`Generate Notes`);
  const syncNotes = () => console.log(`Sync Notes`);
  export let open;
</script>

<!-- {#if open} -->
<ul transition:slide|local>
  <li>
    <button on:click={generateNotes}>Generate Notes </button>
  </li>
  <li>
    <button on:click={syncNotes}>Sync Notes</button>
  </li>
</ul>

<!-- {/if} -->
<style>
  ul {
    display: inline-block;
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
</style>
