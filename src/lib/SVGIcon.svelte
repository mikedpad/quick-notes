<script lang="ts">
  export let type: Icon;
  export let alt: string;
  export let size = 24;
  export let fill = 'white';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-labelledby={`${type}-id`}
  class="svg"
  width={size}
  height={size}
  {fill}
  viewBox="0 0 24 24"
>
  <title id={`${type}-id`}>{alt}</title>
  <path fill="none" d="M0 0h24v24H0z" />
  {#if type === 'add'}
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"
    />
  {:else if type === 'generate'}
    <path d="M8 8H6v7c0 1.1.9 2 2 2h9v-2H8V8z" />
    <path
      d="M20 3h-8a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 8h-8V7h8v4zM4 12H2v7c0 1.1.9 2 2 2h9v-2H4v-7z"
    />
  {:else if type === 'save'}
    <path
      d="M17 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z"
    />
  {:else if type === 'load'}
    <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
  {:else if type === 'more'}
    <path
      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
    />
  {:else if type === 'hamburger'}
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  {/if}
</svg>

<style lang="scss">
  .svg {
    display: inline-block;
    width: var(--size);
    height: var(--size);
  }
</style>
