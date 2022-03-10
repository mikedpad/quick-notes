<script lang="ts">
  import DialogButton from '$lib/DialogButton.svelte';
  import ActionButton from '$lib/ActionButton.svelte';
  import Modal from '$lib/Modal.svelte';
  import { modalOpen } from '$data/store';
  import addIcon from '$images/add.svg';
  import tempUi from '$images/temp_ui.png';
  import TextField from '$lib/TextField.svelte';
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
    <TextField label="Name" required />
    <!-- <textarea placeholder="Note details" id="add-note-text" /> -->
  </div>
  <div class="actions" slot="actions">
    <DialogButton label="Add Note" />
  </div>
</Modal>

<style>
  .content {
    display: flex;
    flex-flow: column nowrap;
  }
</style>
