<script lang="ts">
  import Nav from '$lib/Nav.svelte';

  let open = false;

  function toggleMenu(): void {
    open = !open;
    console.log(`Hamburger menu is ${open ? `open` : `closed`}.`);
  }
</script>

<header>
  <div>
    <button on:click={toggleMenu} class:active={open}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="mainMenuAlt"
        viewBox="0 0 24 24"
      >
        <title id="mainMenuAlt">Expand Menu</title>
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </button>
    <h1>Quick Notes</h1>
  </div>
  <Nav bind:open />
</header>

<style lang="scss">
  header {
    position: sticky;
    background-color: var(--header-bg-color);
    box-shadow: var(--header-shadow);
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
    font-weight: 300;
    font-size: 2.25rem;
    margin: 0.25em 0 0.35em;
  }
  button {
    display: block;
    border: 0 none;
    background-color: var(--hamburger-icon-bg);
    line-height: 0;
    padding: 0.5rem;
    margin: 0 0.5rem;
    border-radius: 50%;
    transition: background-color 0.2s ease-in-out;

    &.active {
      background-color: var(--hamburger-icon-bg-hover);
    }
  }
  svg {
    fill: var(--header-color);
    width: 24px;
    height: 24px;
  }
</style>
