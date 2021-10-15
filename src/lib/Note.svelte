<script>
  import SVGIcon from '$lib/SVGIcon.svelte';

  export let id;
  export let title;
  export let content;
</script>

<div {id} class="note">
  <div class="head">
    <h3>
      {title}
    </h3>
    <button>
      <SVGIcon type="more" fill="#0009" alt="More Options" />
    </button>
  </div>
  <div class="content">
    {content}
  </div>
</div>

<style lang="scss">
  .note {
    background-color: linear-gradient(340deg, rgb(209, 209, 54) 0%, rgb(255, 255, 136) 20%);
    padding: 1rem;
  }
  .head {
    display: flex;
    flex-flow: row nowrap;
    margin: 0 0 1rem;
    justify-content: space-between;
    align-items: flex-start;
  }
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    overflow: hidden;
  }
  button {
    display: block;
    border: 0 none;
    background-color: transparent;
    line-height: 0;
    padding: 0.5rem;
    margin: 0;
    border-radius: 50%;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #0003;
    }
  }
  .content {
    display: block;
    overflow-y: scroll;
  }
</style>
