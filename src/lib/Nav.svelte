<script lang="ts">
  import { slide } from 'svelte/transition';
  // import { page } from '$app/stores';
  import AddNote from '$images/note_add.svg';
  import SVGIcon from '$lib/SVGIcon.svelte';

  // let currentPath = $page.path;
  export let open;
</script>

<nav>
  {#if open}
    <ul transition:slide|local>
      <li>
        <a href="/add">
          <SVGIcon type="add" alt="Add Note" />
          Add Note
        </a>
      </li>
      <li>
        <a href="/generate">
          <SVGIcon type="generate" alt="Generate one or more notes" />
          Generate Notes
        </a>
      </li>
      <li>
        <a href="/save">
          <SVGIcon type="save" alt="Save all notes" />
          Save Notes
        </a>
      </li>
      <li>
        <a href="/load">
          <SVGIcon type="load" alt="Load all notes" />
          Load Notes
        </a>
      </li>
    </ul>
  {/if}
</nav>

<style lang="scss">
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    display: block;
  }
  a {
    background-color: transparent;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: 0.25rem 0.5rem 0.5rem;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: all 0.2s ease-in-out;

    &:link,
    &:visited,
    &:active,
    &:hover,
    &:focus {
      color: white;
    }

    &:active,
    &:hover,
    &:focus {
      text-decoration-color: white;
    }

    &:hover {
      background-color: #fff3;
    }
    Icon {
      margin: 0.5rem;
    }
  }
</style>
