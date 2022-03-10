<script lang="ts">
  import { fade } from 'svelte/transition';
  import { modalOpen } from '$data/store';
  import closeIcon from '$images/close.svg';
  import ActionButton from '$lib/form/ActionButton.svelte';

  export let title: string;

  export let confirmBeforeClose = false;
  function confirmClose() {
    if (confirmBeforeClose) {
      window.confirm(`Unsaved changes will be lost. Are you sure?`) && modalOpen.set(false);
      return;
    }
    modalOpen.set(false);
  }
  function handleCloseButton() {
    confirmClose();
  }
  function handleKeyDown(e: KeyboardEvent) {
    if ($modalOpen && e.key === 'Escape') confirmClose();
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
{#if $modalOpen}
  <div class="background" transition:fade={{ duration: 100 }}>
    <div class="paper">
      <div class="dialog-title">
        <span class="title">
          {title}
        </span>
        <ActionButton
          mini
          title="Close Dialog"
          iconHref={`${closeIcon}#svgId`}
          on:click={handleCloseButton}
          --box-shadow="none"
          --border-radius="0"
        />
      </div>
      <div class="dialog-content">
        <slot>
          <p>Undefined... No modal content provided.</p>
        </slot>
      </div>
    </div>
  </div>
{/if}

<style>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .paper {
    background-color: white;
    color: black;
    border-radius: 8px;
    box-shadow: var(--default-shadow);
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    min-width: 300px;
    min-height: 200px;
  }
  .dialog-title {
    flex: 0 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .dialog-content {
    flex: 1 0;
  }
  .title {
    display: block;
    font-size: 32px;
    font-weight: 500;
    margin: 0 16px 0 20px;
    flex: 1;
  }
</style>
