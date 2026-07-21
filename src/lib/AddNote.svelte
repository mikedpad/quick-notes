<script lang="ts">
  import { modalOpen } from '$data/store';
  import ActionButton from '$lib/form/ActionButton.svelte';
  import DialogButton from '$lib/DialogButton.svelte';
  import Modal from '$lib/Modal.svelte';
  import TextArea from '$lib/form/TextArea.svelte';
  import TextField from '$lib/form/TextField.svelte';
  import addIcon from '$images/add.svg';

  let inputTitle: TextField;
  let inputContents: TextArea;
</script>

<ActionButton
  title="Add New Note"
  iconHref={`${addIcon}#svgId`}
  floating
  on:click={() => ($modalOpen = true)}
  --bgColor="var(--burnt-sienna)"
  --color="white"
/>

<Modal title="Add Note" confirmBeforeClose>
  <form method="post" action="/">
    <div class="content">
      <TextField label="Title" required bind:this={inputTitle} />
      <TextArea label="Contents" required bind:this={inputContents} />
    </div>
    <div class="actions">
      <DialogButton label="Add New Note" type="submit" />
    </div>
  </form>
</Modal>

<style>
  .content {
    display: flex;
    flex-flow: column nowrap;
    margin: 0 16px;
  }
  .actions {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
  }
</style>
