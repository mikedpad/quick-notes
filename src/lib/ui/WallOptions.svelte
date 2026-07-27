<script lang="ts">
  import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
  import {
    SCATTER_RANGE,
    VARIANCE_RANGE,
    WALL_SURFACES,
    ZOOM_RANGE,
    type WallControls,
    type WallSurface,
  } from '$lib/state/wall.svelte';

  /**
   * How the wall is hung, as a menu.
   *
   * Presentational: it is handed something shaped like `WallControls` and writes
   * to it. Where those settings come from, and whether they outlive the tab, is
   * not its problem.
   */
  type Props = {
    settings: WallControls;
  };

  let { settings }: Props = $props();

  const LABELS: Record<WallSurface, string> = {
    plaster: 'Plaster',
    cork: 'Cork',
    charcoal: 'Charcoal',
  };

  let open = $state(false);
  let root = $state<HTMLDivElement>();

  const scatterLabel = $derived(settings.scatter === 0 ? 'tidy' : settings.scatter.toFixed(1));
  const varianceLabel = $derived(
    settings.variance === 0 ? 'even' : `±${Math.round(settings.variance * 100)}%`,
  );
  const zoomLabel = $derived(`+${Math.round((settings.zoom - 1) * 100)}%`);
</script>

<!-- A menu that cannot be dismissed by clicking away or pressing Escape is a
     trap, so both close it. -->
<svelte:window
  onpointerdown={event => {
    if (open && root && !root.contains(event.target as Node)) open = false;
  }}
  onkeydown={event => {
    if (event.key === 'Escape') open = false;
  }}
/>

<div class="options" bind:this={root}>
  <button
    type="button"
    class="trigger"
    aria-label="Wall options"
    title="Wall options"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <SlidersHorizontal size={18} aria-hidden="true" />
  </button>

  {#if open}
    <div class="panel">
      <span class="tape" aria-hidden="true"></span>

      <fieldset class="field">
        <legend>Wall</legend>
        <div class="chips">
          {#each WALL_SURFACES as surface (surface)}
            <button
              type="button"
              class="chip"
              class:picked={settings.surface === surface}
              aria-pressed={settings.surface === surface}
              onclick={() => (settings.surface = surface)}
            >
              {LABELS[surface]}
            </button>
          {/each}
        </div>
      </fieldset>

      <label class="field">
        <span class="row">
          <span class="name">Scatter</span>
          <span class="value">{scatterLabel}</span>
        </span>
        <input
          type="range"
          min={SCATTER_RANGE.min}
          max={SCATTER_RANGE.max}
          step={SCATTER_RANGE.step}
          bind:value={settings.scatter}
        />
      </label>

      <!-- How much notes are allowed to disagree about the scatter. Without it
           the angles cycle, and a wall of evenly-crooked notes reads as a
           pattern rather than as a mess. -->
      <label class="field">
        <span class="row">
          <span class="name">Variance</span>
          <span class="value">{varianceLabel}</span>
        </span>
        <input
          type="range"
          min={VARIANCE_RANGE.min}
          max={VARIANCE_RANGE.max}
          step={VARIANCE_RANGE.step}
          bind:value={settings.variance}
        />
      </label>

      <label class="field">
        <span class="row">
          <span class="name">Hover zoom</span>
          <span class="value">{zoomLabel}</span>
        </span>
        <input
          type="range"
          min={ZOOM_RANGE.min}
          max={ZOOM_RANGE.max}
          step={ZOOM_RANGE.step}
          bind:value={settings.zoom}
        />
      </label>

      <div class="row">
        <span class="name">Tape</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked={settings.taped}
          aria-label="Tape"
          onclick={() => (settings.taped = !settings.taped)}
        >
          <span class="knob"></span>
        </button>
      </div>

      <!-- No confirmation: every setting here is one drag away from being put back. -->
      <button type="button" class="reset" onclick={() => settings.reset()}> Start over </button>
    </div>
  {/if}
</div>

<style>
  .options {
    position: relative;
    display: flex;
    align-items: center;
  }

  .trigger {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.5);
    color: var(--color-ink);
    cursor: pointer;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
    transition: background 0.15s ease;
  }

  .trigger:hover {
    background: rgb(255 255 255 / 0.85);
  }

  /* A small sheet of the notepad's own paper, torn off and taped up. */
  .panel {
    position: absolute;
    top: 52px;
    right: 0;
    z-index: 80;
    width: 250px;
    background: linear-gradient(178deg, #fffef8 0%, #fbf8ee 80%, #f2edda 100%);
    box-shadow:
      0 3px 6px rgb(0 0 0 / 0.15),
      0 18px 30px -10px rgb(0 0 0 / 0.4);
    transform: rotate(0.8deg);
    padding: 24px 18px 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--color-ink);
  }

  .tape {
    position: absolute;
    top: -11px;
    left: 50%;
    width: 88px;
    height: 24px;
    margin-left: -44px;
    background: rgb(250 246 228 / 0.75);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
    transform: rotate(-2deg);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: 0;
    padding: 0;
    margin: 0;
  }

  legend,
  .name {
    font-family: var(--font-hand);
    font-weight: 700;
    font-size: 20px;
    padding: 0;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .value {
    font-size: 12px;
    opacity: 0.6;
  }

  .chips {
    display: flex;
    gap: 8px;
  }

  .chip {
    flex: 1;
    border: 1.5px solid rgb(0 0 0 / 0.25);
    border-radius: 999px;
    background: transparent;
    color: var(--color-ink);
    font-family: var(--font-note);
    font-size: 12.5px;
    padding: 5px 0 6px;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }

  .chip:hover:not(.picked) {
    background: rgb(0 0 0 / 0.06);
  }

  .chip.picked {
    background: var(--color-ink);
    border-color: var(--color-ink);
    color: var(--color-paper);
  }

  input[type='range'] {
    width: 100%;
    accent-color: var(--color-ink);
    cursor: pointer;
  }

  .switch {
    position: relative;
    width: 46px;
    height: 24px;
    flex: none;
    border: 0;
    border-radius: 999px;
    background: rgb(0 0 0 / 0.2);
    cursor: pointer;
    padding: 0;
    transition: background 0.15s ease;
  }

  .switch[aria-checked='true'] {
    background: var(--color-ink);
  }

  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-paper);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.3);
    transition: left 0.15s ease;
  }

  .switch[aria-checked='true'] .knob {
    left: 25px;
  }

  /* Set apart from the controls it undoes, and quiet enough not to invite a click. */
  .reset {
    align-self: flex-end;
    margin-top: -4px;
    border: 0;
    background: transparent;
    padding: 2px;
    font-family: var(--font-hand);
    font-size: 17px;
    color: var(--color-ink);
    opacity: 0.55;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .reset:hover {
    opacity: 0.9;
  }

  .trigger:focus-visible,
  .chip:focus-visible,
  .switch:focus-visible,
  .reset:focus-visible,
  input[type='range']:focus-visible {
    outline: 2px solid var(--color-ink);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .trigger,
    .chip,
    .switch,
    .knob,
    .reset {
      transition: none;
    }
  }
</style>
