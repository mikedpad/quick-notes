<script>
  import { Tile, OverflowMenu, OverflowMenuItem, Modal } from 'carbon-components-svelte';

  let open = false;
  export let title;
  export let content;

  const openModal = () => (open = true);
  const closeModal = () => (open = false);
  const deleteNote = () => {
    console.log(`Note has been deleted`);
    closeModal();
  };
</script>

<Tile>
  <div class="header">
    <h3 class="title">{title}</h3>
    <OverflowMenu direction="bottom">
      <OverflowMenuItem primaryFocus danger text="Delete Note" on:click={openModal} />
    </OverflowMenu>
  </div>
  <div class="content">
    {content}
  </div>
</Tile>
<Modal
  danger
  bind:open
  modalHeading={`Delete "${title}"`}
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={closeModal}
  on:submit={deleteNote}
>
  <p>This is a permanent action and cannot be undone.</p>
</Modal>

<!-- <style lang="scss">
  $noteColor: rgb(209, 209, 54);

  /* .card {
    background: linear-gradient(340deg, 0%, $noteColor 20%);
  } */
</style> -->
