<script lang="ts">
  import Icon from '$lib/SVGIcon.svelte';
  import Nav from '$lib/Nav.svelte';

  let open = false;
  function toggleMenu(): void {
    open = !open;
    console.log(open);
  }
</script>

<header>
  <div>
    <button on:click={toggleMenu}>
      <Icon type="hamburger" alt="Expand menu" />
    </button>
    <h1>Quick Notes</h1>
  </div>
  <Nav bind:open />
</header>

<style lang="scss">
  header {
    background-color: black;
    color: white;
  }
  div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  button {
    display: block;
    border: 0 none;
    background-color: transparent;
    line-height: 0;
    padding: 0.5rem;
    margin: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #fff3;
    }
  }
  h1 {
    font-weight: 300;
    font-size: 2.25rem;
    margin: 1rem 0;
  }
</style>
