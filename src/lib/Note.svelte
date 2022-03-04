<script lang="ts">
  export let id: string;
  export let title: string;
  export let content: string[];
  export let createdAt: Date;
  export let updatedAt: Date;
</script>

<article {id}>
  <h2>
    {title}
  </h2>
  <div>
    {#each content as line}
      <p>{line}</p>
    {/each}
  </div>
  <time datetime={createdAt.toString()}>Created on {createdAt.toDateString()}</time>
  <time datetime={updatedAt.toString()}>Updated on {updatedAt.toDateString()}</time>
</article>

<style>
  article {
    --note-fade-height: 20px;
    --note-bg: var(--cream);
    --note-bg-accent: var(--anti-cream);
    --note-menu-icon-color: #000;
    --note-padding: 0.5rem;
    background: linear-gradient(0deg, var(--note-bg-accent) 0%, var(--note-bg) 40%);
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 30%);
    border-radius: 8px;
    border: 1px solid var(--note-border);
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    aspect-ratio: 1;
    max-width: var(--note-width);
    max-height: var(--note-width);
    overflow: scroll;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
  }
  h2 {
    font-size: 1.25rem;
    line-height: 1;
    margin: 1rem 0.75rem 0.5rem;
  }
  div {
    overflow-y: scroll;
  }
  p {
    margin: 1em 0.75rem;
  }
  p:first-child {
    margin: 0 0.75rem 1rem;
  }
  time {
    display: none;
  }
</style>
