<script lang="ts">
  import type { ButtonType } from '$types/types';

  export let label: string;
  export let type: ButtonType = 'button';
</script>

<button {type} on:click>
  {label}
</button>

<style>
  button {
    background-color: var(--bgColor, #203131);
    color: var(--color, white);
    border: 0;
    border-radius: 4px;
    box-shadow: var(--default-shadow);
    min-width: 64px;
    margin: 16px;
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
    text-transform: uppercase;
  }
</style>
