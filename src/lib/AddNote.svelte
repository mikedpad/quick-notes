<script lang="ts">
  import { modalOpen } from '$data/store';
  import plusSvg from '$images/nav/add.svg';

  modalOpen.subscribe(() => {
    console.log(`Subscription update -- modalOpen is ${$modalOpen}`);
  });

  function handleClick() {
    $modalOpen = !$modalOpen;
  }
</script>

<button on:click={handleClick}>
  <img src={plusSvg} alt="Add Note" />
</button>

<style>
  button {
    border: 0;
    border-radius: 50%;
    background-color: var(--ui-btn-add-note);
    display: block;
    position: fixed;
    padding: 0;
    margin: 0;
    width: 56px;
    height: auto;
    bottom: 16px;
    right: 16px;
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
    margin: 16px;
    padding: 0;
  }
</style>
