<script lang="ts">
  import { fade } from 'svelte/transition';
  import { getValidityListeners } from '$lib/scripts/validateInput';

  // Props
  export let label: string;
  export let required = false;

  let inputText: HTMLInputElement;
  export function getValue() {
    return inputText.value;
  }
  export function isEmpty() {
    return inputText.value.length === 0;
  }

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
    bind:this={inputText}
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
