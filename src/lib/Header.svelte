<script lang="ts">
  import { navOpen } from '$data/store';
  import Nav from '$lib/Nav.svelte';

  const toggleDrawer = () => ($navOpen = !$navOpen);
</script>

<header>
  <div>
    <h1>Quick Notes</h1>
  </div>
  <Nav bind:open={$navOpen} />
</header>

<style>
  header {
    position: sticky;
    background-color: var(--header-bg-color);
    box-shadow: var(--header-box-shadow);
    color: var(--header-color);
    top: 0;
  }
  div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  h1 {
    margin: 0.25em 0 0.35em;
  }
</style>
