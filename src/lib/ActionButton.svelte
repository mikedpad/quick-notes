<script lang="ts">
  export let title: string;
  export let iconHref: string;
  export let mini: boolean = false;
  export let floating: boolean = false;

  // Disable until validated
  // export let validate: () => boolean = undefined;

  const id = `${title.toLowerCase().split(' ').join('-')}-svg`;
</script>

<button class:mini class:floating on:click>
  <svg role="img" width="24" height="24" aria-labelledby={id}>
    <title {id}>{title}</title>
    <use href={iconHref} />
  </svg>
</button>

<style>
  button {
    border: 0;
    border-radius: 50%;
    background-color: var(--bgColor, #203131);
    color: var(--color, white);
    box-shadow: var(--default-shadow);
    display: block;
    padding: 0;
    margin: 16px;
    width: 56px;
    height: 56px;
    user-select: none;
  }
  .floating {
    position: fixed;
    bottom: 16px;
    right: 16px;
    margin: 0;
  }
  .mini {
    width: 40px;
    height: 40px;
  }
  .mini.floating {
    margin: 0;
  }
  /* .disabled {
    background-color: gray;
    opacity: 0.5;
    pointer-events: none;
  } */

  svg {
    color: var(--color, '#fff');
    display: block;
    width: 24px;
    height: 24px;
    margin: 16px;
    padding: 0;
  }
  .mini svg {
    margin: 8px;
  }
</style>
