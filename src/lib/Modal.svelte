<script lang="ts">
  import { fade } from 'svelte/transition';
  import { modalOpen } from '$data/store';
  import DialogButton from '$lib/DialogButton.svelte';
  import closeIcon from '$images/close.svg';
  import ActionButton from '$lib/ActionButton.svelte';

  let modalElement: HTMLDivElement;
  // function closeModal(e: Event) {
  //   if (e.target === modalElement) modalOpen.set(false);
  // }
  function onEscapeKey(e: KeyboardEvent) {
    if ($modalOpen && e.key === 'Escape') modalOpen.set(false);
  }
</script>

<svelte:window on:keydown={onEscapeKey} />
{#if $modalOpen}
  <div class="background" transition:fade={{ duration: 100 }} bind:this={modalElement}>
    <div class="dialog">
      <div class="dialog-title">
        <span class="title">
          <slot name="title">Undefined Title</slot>
        </span>
      </div>
      <div class="dialog-content">
        <slot name="content">
          <p>Undefined... No modal content provided.</p>
        </slot>
      </div>
      <div class="dialog-actions">
        <ActionButton
          mini
          title="Close Dialog"
          iconHref={`${closeIcon}#svgId`}
          on:click={() => modalOpen.set(false)}
        />
        <slot name="actions" />
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

  .dialog {
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
    padding: 0 16px;
  }
  .dialog-content {
    flex: 1 0;
    padding: 0 16px;
  }
  .dialog-actions {
    flex: 0 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    display: block;
    font-size: 28px;
    font-weight: 700;
    margin: 8px 0;
  }
</style>
