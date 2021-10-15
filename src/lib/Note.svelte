<script lang="ts">
  export let id;
  export let title;
  export let content;

  let open = false;

  function toggleOptions(): void {
    open = !open;
    console.log(`Menu for ${id} is ${open ? `open` : `closed`}.`);
  }
</script>

<article {id}>
  <header>
    <h3>
      {title}
    </h3>
    <button on:click={toggleOptions} class:active={open}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="moreOptionsAlt"
        viewBox="0 0 24 24"
      >
        <title id="moreOptionsAlt">More Options</title>
        <path
          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        />
      </svg>
    </button>
  </header>
  <div class="content">
    {content}
  </div>
</article>

<style lang="scss">
  @use 'breakpoints';

  article {
    background: var(--note-bg);
    box-shadow: var(--note-shadow);
    aspect-ratio: 1 / 1;

    // Aspect-ratio fallback
    // https://css-tricks.com/almanac/properties/a/aspect-ratio/#dealing-with-legacy-browser-support
    &::before {
      float: left;
      padding-top: 100%;
      content: '';
    }

    &::after {
      display: block;
      content: '';
      clear: both;
    }
  }
  header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-start;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    flex-flow: 1 0;
    margin: 0;
    overflow: hidden;
    padding: var(--note-padding) 0 0 var(--note-padding);

    @include breakpoints.md {
      font-size: 1.25rem;
    }
  }
  button {
    display: block;
    border: 0 none;
    background-color: transparent;
    line-height: 0;
    padding: var(--note-padding);
    margin: 0;
    border-radius: 50%;
    flex-flow: 0 0;
    transition: background-color 0.2s ease-in-out;

    &.active {
      background-color: var(--hamburger-hover);
    }
  }
  svg {
    fill: var(--note-menu-icon-color);
    width: 24px;
    height: 24px;
  }
  .content {
    display: block;
    font-size: 1.25rem;
    overflow-y: scroll;
    padding: var(--note-padding);

    @include breakpoints.md {
      font-size: 1rem;
    }
  }
</style>
