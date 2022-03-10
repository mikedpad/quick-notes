<script lang="ts">
  import { fade } from 'svelte/transition';
  import { getValidityListeners } from '$lib/scripts/validateInput';

  // Props
  export let label: string;
  export let required = false;

  const { id, onInput, onInvalid } = getValidityListeners('textfield');
</script>

<div class="container">
  <input
    type="text"
    name={label}
    class="inputField"
    {id}
    placeholder=" "
    {required}
    on:input={onInput}
    on:invalid={onInvalid}
  />
  <label for={id}>
    {label}
    {#if required}
      <span class="asterisk">*</span>
    {/if}
  </label>
  <span class="error" transition:fade={{ duration: 100 }} />
</div>

<style>
  @import './styles/inputField.css';
</style>
