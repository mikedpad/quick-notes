<script context="module">
  let modalId;
</script>

<script lang="ts">
  import { modalOpen } from '$data/store';

  const toggleModal = () => {
    $modalOpen = !$modalOpen;
    modalId = id;
    $modalOpen
      ? document.body.classList.add(`modalOpen`)
      : document.body.classList.remove(`modalOpen`);
  };

  export let id: string;
  export let title: string;
  export let content: string;
</script>

<article {id}>
  <h2>
    {title}
  </h2>
  <span class="content">
    {content}
  </span>
</article>

<style>
  article {
    background: var(--note-bg);
    box-shadow: var(--note-box-shadow);
    margin: 0;
    padding: 0;
    height: auto;
    width: 100%;
    aspect-ratio: 1;
    max-width: var(--note-width);
  }
  h2 {
    font-size: 1.25rem;
    line-height: 1;
    margin: 1rem 0.75rem;
  }
  span {
    display: block;
    margin: 0.75rem;
  }
</style>
