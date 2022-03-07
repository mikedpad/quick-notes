<script lang="ts">
  import DialogButton from '$lib/DialogButton.svelte';
  import ActionButton from '$lib/ActionButton.svelte';
  import Modal from '$lib/Modal.svelte';
  import { modalOpen } from '$data/store';
  import addIcon from '$images/add.svg';

  let nnTitle: HTMLInputElement;
  let nnText: HTMLTextAreaElement;

  function createNote() {
    console.log(nnTitle.value, nnText.value);
  }
</script>

<ActionButton
  title="Add New Note"
  iconHref={`${addIcon}#svgId`}
  floating
  on:click={() => ($modalOpen = true)}
  --bgColor="var(--btn-add-note)"
/>
<Modal>
  <div class="title" slot="title">Add Note</div>
  <div class="content" slot="content">
    <input type="text" placeholder="Title" bind:this={nnTitle} />
    <textarea placeholder="Note details" id="add-note-text" bind:this={nnText} />
  </div>
  <div class="actions" slot="actions">
    <DialogButton label="Add Note" on:click={createNote} />
  </div>
</Modal>

<style>
  .content {
    display: flex;
    flex-flow: column nowrap;
  }
</style>
