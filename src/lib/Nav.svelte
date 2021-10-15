<script lang="ts">
  import { slide } from 'svelte/transition';
  // import { page } from '$app/stores';
  // let currentPath = $page.path;

  export let open;
</script>

<nav>
  {#if open}
    <ul transition:slide|local>
      <li>
        <a href="/add">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="addNoteAlt"
            viewBox="0 0 24 24"
          >
            <title id="addNoteAlt">Add Note</title>
            <path
              d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"
            />
          </svg>
          <span>Add Note</span>
        </a>
      </li>
      <li>
        <a href="/generate">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="generateNoteAlt"
            viewBox="0 0 24 24"
          >
            <title id="generateNoteAlt">Generate more notes</title>
            <path
              d="M20 3h-8a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 8h-8V7h8v4zM4 12H2v7c0 1.1.9 2 2 2h9v-2H4v-7z"
            />
          </svg>
          <span>Generate Notes</span>
        </a>
      </li>
      <li>
        <a href="/save">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="saveNoteAlt"
            viewBox="0 0 24 24"
          >
            <title id="saveNoteAlt">Save all notes</title>
            <path
              d="M17 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z"
            />
          </svg>
          <span>Save Notes</span>
        </a>
      </li>
      <li>
        <a href="/load">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="loadNoteAlt"
            viewBox="0 0 24 24"
          >
            <title id="loadNoteAlt">Load all notes</title>
            <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
          </svg>
          <span>Load Notes</span>
        </a>
      </li>
    </ul>
  {/if}
</nav>

<style lang="scss">
  ul {
    display: inline-block;
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  a {
    background-color: transparent;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    overflow: hidden;

    &:link,
    &:visited,
    &:active,
    &:hover,
    &:focus {
      color: var(--nav-link-color);
    }

    &:hover {
      background-color: var(--nav-link-color-hover);
    }
  }
  svg {
    fill: white;
    width: 24px;
    height: 24px;
    margin: 0.75rem 1rem;
  }
  span {
    display: block;
    margin: 0 1rem 0 0;
  }
</style>
