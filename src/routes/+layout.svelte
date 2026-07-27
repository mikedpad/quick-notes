<script lang="ts">
  import type { Snippet } from 'svelte';
  import WallOptions from '$lib/ui/WallOptions.svelte';
  import { notes } from '$lib/state/notes.svelte';
  import { wall } from '$lib/state/wall.svelte';
  import '../styles/app.css';

  let { children }: { children: Snippet } = $props();

  // Held back until the notes are actually in: a scribble reading "0 notes on
  // the wall" while they load says something that isn't true.
  const count = $derived(
    notes.status === 'ready'
      ? `${notes.count} ${notes.count === 1 ? 'note' : 'notes'} on the wall`
      : '',
  );

  // The surface belongs on <html> — see the note in app.css. `app.html` sets it
  // before the first paint; from here on it follows the setting.
  $effect(() => {
    document.documentElement.dataset.wall = wall.surface;
  });
</script>

<header>
  <!-- Masking tape, torn off and stuck on: two dashed edges and a crooked lie. -->
  <div class="plate">
    <h1>Quick Notes</h1>
  </div>

  <div class="corner">
    <span class="count">{count}</span>
    <WallOptions settings={wall} />
  </div>
</header>

<main>
  {@render children()}
</main>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 28px 40px 0;
    position: relative;
    z-index: 5;
  }

  .plate {
    background: rgb(244 238 216 / 0.92);
    padding: 6px 34px 8px;
    transform: rotate(-1.4deg);
    box-shadow:
      0 2px 5px rgb(0 0 0 / 0.18),
      inset 0 0 14px rgb(160 140 90 / 0.18);
    border-left: 2px dashed rgb(0 0 0 / 0.06);
    border-right: 2px dashed rgb(0 0 0 / 0.06);
  }

  h1 {
    margin: 0;
    font-family: var(--font-hand);
    font-weight: 700;
    font-size: 34px;
    line-height: 1.1;
    color: var(--color-ink);
  }

  .corner {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .count {
    font-family: var(--font-hand);
    font-size: 20px;
    opacity: 0.65;
    transform: rotate(1deg);
    color: var(--wall-ink);
    white-space: nowrap;
  }

  main {
    max-width: 88rem;
    margin: 0 auto;
    padding: 36px 40px 120px;
  }

  @media (width < 40rem) {
    header {
      padding: 20px 20px 0;
    }

    h1 {
      font-size: 28px;
    }

    /* The count is the first thing to go: the options button has to stay. */
    .count {
      display: none;
    }

    main {
      padding: 28px 20px 110px;
    }
  }
</style>
