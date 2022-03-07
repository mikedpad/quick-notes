<script lang="ts">
  export let label: string;
</script>

<button on:click>
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
