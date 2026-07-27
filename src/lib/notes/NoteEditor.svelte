<script lang="ts">
  import { untrack } from 'svelte';
  import X from '@lucide/svelte/icons/x';
  import ConfirmDialog from '$lib/ui/ConfirmDialog.svelte';
  import { PAPERS, paperAt, paperVars } from '$lib/ui/paper';
  import { EMPTY_DRAFT, validateDraft, type NoteDraft } from '$lib/domain/note';

  type Props = {
    open: boolean;
    /** Absent for a new note; supplied when editing an existing one. */
    draft?: NoteDraft;
    /** Only changes the wording — the form itself is the same either way. */
    editing?: boolean;
    onsubmit: (draft: NoteDraft) => void | Promise<void>;
  };

  let { open = $bindable(false), draft = EMPTY_DRAFT, editing = false, onsubmit }: Props = $props();

  let dialog = $state<HTMLDialogElement>();
  let sheet = $state<HTMLFormElement>();
  let values = $state<NoteDraft>({ ...EMPTY_DRAFT });
  let submitted = $state(false);
  let saving = $state(false);
  let confirmingDiscard = $state(false);

  /** Set once the sheet has been dragged; until then its height follows its content. */
  let height = $state<number | null>(null);

  // Seed the form on the closed→open transition, so a cancelled edit doesn't
  // leak into the next one. `draft` is read untracked: reacting to it as well
  // would reset the form mid-edit if the underlying note changed.
  $effect(() => {
    if (!open) return;
    untrack(() => {
      values = { ...draft };
      submitted = false;
      height = null;
    });
  });

  // `showModal()` is what gives us the focus trap, the inert background, the
  // ::backdrop and Escape-to-close — none of which we have to implement.
  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });

  const errors = $derived(validateDraft(values));
  const hasErrors = $derived(Object.keys(errors).length > 0);
  const dirty = $derived(
    values.title !== draft.title || values.body !== draft.body || values.color !== draft.color,
  );
  const paper = $derived(paperAt(values.color ?? 0));

  /** Unsaved work is only ever discarded after asking. */
  function requestClose() {
    if (dirty) confirmingDiscard = true;
    else open = false;
  }

  /**
   * Clicking off the note puts it back on the wall.
   *
   * A modal <dialog> fills the viewport, so a click on the backdrop lands on the
   * dialog element itself — but only counting clicks that both started and
   * ended out there. Otherwise a text selection dragged out of the textarea, or
   * a resize that overshoots, would dismiss the note mid-gesture.
   */
  let pressedOutside = false;

  const outside = (event: MouseEvent) => !!sheet && !sheet.contains(event.target as Node);

  function handleBackdropDown(event: MouseEvent) {
    pressedOutside = outside(event);
  }

  function handleBackdropClick(event: MouseEvent) {
    if (pressedOutside && outside(event)) requestClose();
    pressedOutside = false;
  }

  /**
   * Dragging either edge makes the note taller or shorter — the paper equivalent
   * of the textarea's resize corner, which this replaces.
   *
   * The sheet is centred by `margin: auto`, so it grows away from its middle in
   * both directions at once: an edge only keeps up with the cursor if the height
   * changes by twice the distance dragged.
   */
  const MIN_HEIGHT = 320;
  const maxHeight = () => Math.round(innerHeight * 0.88);

  const clampHeight = (value: number) => Math.max(MIN_HEIGHT, Math.min(maxHeight(), value));

  function startResize(event: PointerEvent, edge: 1 | -1) {
    if (!sheet) return;
    event.preventDefault();

    const handle = event.currentTarget as HTMLElement;
    const startY = event.clientY;
    const startHeight = sheet.getBoundingClientRect().height;
    handle.setPointerCapture(event.pointerId);

    const move = (moved: PointerEvent) => {
      height = clampHeight(startHeight + (moved.clientY - startY) * 2 * edge);
    };
    const stop = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', stop);
      handle.removeEventListener('pointercancel', stop);
    };

    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  }

  /** The same resize, for anyone who reached the handle by keyboard. */
  function nudge(event: KeyboardEvent, edge: 1 | -1) {
    const direction = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!direction || !sheet) return;

    event.preventDefault();
    height = clampHeight(sheet.getBoundingClientRect().height + direction * 2 * edge * 16);
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    if (hasErrors || saving) return;

    saving = true;
    try {
      await onsubmit({ ...values });
      open = false;
    } finally {
      saving = false;
    }
  }
</script>

<dialog
  bind:this={dialog}
  aria-label={editing ? 'Edit note' : 'New note'}
  oncancel={event => {
    // Escape: route through the same guard as the close button.
    event.preventDefault();
    requestClose();
  }}
  onpointerdown={handleBackdropDown}
  onclick={handleBackdropClick}
>
  <!-- One big sticky note, taped to the middle of the screen. -->
  <form
    bind:this={sheet}
    class="sheet"
    style="{paperVars(paper)}{height === null ? '' : ` height: ${height}px;`}"
    onsubmit={handleSubmit}
  >
    <span class="tape" aria-hidden="true"></span>

    <div class="scroll">
      <header>
        <span class="mode">{editing ? 'editing…' : 'a fresh note'}</span>
        <button type="button" class="close" aria-label="Close" onclick={requestClose}>
          <X size={16} aria-hidden="true" />
        </button>
      </header>

      <input
        name="title"
        class="title"
        placeholder="Title goes here…"
        bind:value={values.title}
        aria-invalid={submitted && errors.title ? 'true' : undefined}
        aria-describedby={submitted && errors.title ? 'title-error' : undefined}
      />
      {#if submitted && errors.title}
        <p id="title-error" class="error">{errors.title}</p>
      {/if}

      <!-- Ruled like a notepad, and still markdown underneath. -->
      <textarea
        name="body"
        class="body"
        placeholder="Scribble something…"
        bind:value={values.body}
        aria-invalid={submitted && errors.body ? 'true' : undefined}
        aria-describedby={submitted && errors.body ? 'body-error' : undefined}></textarea>
      {#if submitted && errors.body}
        <p id="body-error" class="error">{errors.body}</p>
      {/if}
    </div>

    <footer>
      <fieldset class="papers">
        <legend class="sr-only">Paper</legend>
        {#each PAPERS as option, index (option.name)}
          <label class="swatch" style="--swatch: {option.base}" title={option.name}>
            <input type="radio" name="color" value={index} bind:group={values.color} />
            <span class="sr-only">{option.name}</span>
          </label>
        {/each}
      </fieldset>

      <div class="acts">
        <button type="button" class="ghost" onclick={requestClose}>Cancel</button>
        <button type="submit" class="pill" disabled={saving}>
          {#if saving}
            Saving…
          {:else}
            {editing ? 'Save it' : 'Stick it'}
          {/if}
        </button>
      </div>
    </footer>

    <!-- Last in the markup so the writing comes first in the tab order. -->
    <button
      type="button"
      class="grip top"
      aria-label="Resize the note from its top edge"
      onpointerdown={event => startResize(event, -1)}
      onkeydown={event => nudge(event, -1)}
    ></button>
    <button
      type="button"
      class="grip bottom"
      aria-label="Resize the note from its bottom edge"
      onpointerdown={event => startResize(event, 1)}
      onkeydown={event => nudge(event, 1)}
    ></button>
  </form>
</dialog>

<ConfirmDialog
  bind:open={confirmingDiscard}
  title="Throw this away?"
  message="This note has scribbles on it that have not been saved."
  confirmLabel="Bin it"
  cancelLabel="Keep writing"
  destructive
  onconfirm={() => (open = false)}
/>

<style>
  dialog {
    border: 0;
    padding: 0;
    background: none;
    max-width: none;
    max-height: none;
    /* Tailwind's preflight zeroes every margin, including the `auto` a modal
       <dialog> is centred by. Putting it back is the whole centring. */
    margin: auto;
    /* The tape overhangs the top edge of the sheet. */
    overflow: visible;
    color: var(--color-ink);
  }

  dialog::backdrop {
    background: rgb(48 40 24 / 0.45);
    backdrop-filter: blur(2px);
  }

  .sheet {
    position: relative;
    width: min(30rem, calc(100vw - 2rem));
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      178deg,
      var(--paper-light) 0%,
      var(--paper-base) 26%,
      var(--paper-base) 78%,
      var(--paper-shade) 100%
    );
    transform: rotate(-0.6deg);
    box-shadow: var(--shadow-sheet);
    padding: 34px 28px 24px;
  }

  .tape {
    position: absolute;
    top: -13px;
    left: 50%;
    width: 120px;
    height: 30px;
    margin-left: -60px;
    background: rgb(250 246 228 / 0.6);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
    transform: rotate(-2deg);
  }

  /* Only the written-on part scrolls, so the tape and the buttons stay put. It
     is a column as well, so a note dragged taller gives the space to the
     writing rather than leaving it blank under the last ruled line. */
  .scroll {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  /**
   * Grab either edge to make the note taller or shorter. They sit inside the
   * sheet's padding, where there is nothing to write on, and they are buttons
   * so the gesture has a keyboard equivalent (arrow keys) rather than being
   * mouse-only the way the textarea's resize corner was.
   */
  .grip {
    position: absolute;
    left: 0;
    right: 0;
    height: 14px;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: ns-resize;
    touch-action: none;
  }

  .grip.top {
    top: 0;
  }

  .grip.bottom {
    bottom: 0;
  }

  /* A pair of scored lines, the way a torn edge shows where to pull. */
  .grip::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 34px;
    height: 4px;
    translate: -50% -50%;
    border-top: 1px solid rgb(0 0 0 / 0.18);
    border-bottom: 1px solid rgb(0 0 0 / 0.18);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .sheet:hover .grip::after,
  .grip:focus-visible::after {
    opacity: 1;
  }

  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .mode {
    font-family: var(--font-hand);
    font-size: 19px;
    opacity: 0.55;
  }

  .close {
    width: 32px;
    height: 32px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.45);
    color: var(--color-ink);
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .close:hover {
    background: rgb(255 255 255 / 0.8);
  }

  .title {
    width: 100%;
    background: transparent;
    border: 0;
    border-bottom: 2px dashed rgb(0 0 0 / 0.18);
    border-radius: 0;
    outline: none;
    font-family: var(--font-hand);
    font-weight: 700;
    font-size: 30px;
    color: var(--color-ink);
    padding: 4px 2px 6px;
    margin-top: 4px;
  }

  /**
   * The ruled lines are a background, and the line-height matches their pitch,
   * so the writing sits on them. `local` attachment keeps the ruling with the
   * text when the field scrolls rather than sliding out from under it.
   */
  .body {
    width: 100%;
    /* Grows into whatever height the sheet has been dragged to. `resize` is
       deliberately absent: the edges of the note do that job now. */
    flex: 1;
    resize: none;
    min-height: 200px;
    margin-top: 14px;
    background-image: repeating-linear-gradient(transparent 0 26px, rgb(0 0 0 / 0.09) 26px 27px);
    background-attachment: local;
    background-color: transparent;
    border: 0;
    outline: none;
    font-family: var(--font-note);
    font-weight: 300;
    font-size: 15px;
    line-height: 27px;
    color: var(--color-ink);
  }

  .title::placeholder,
  .body::placeholder {
    color: var(--color-ink);
    opacity: 0.35;
  }

  .title:focus-visible,
  .body:focus-visible {
    outline: 2px solid rgb(0 0 0 / 0.35);
    outline-offset: 3px;
  }

  .error {
    margin: 4px 0 0;
    font-size: 12.5px;
    color: var(--color-crimson);
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 18px;
    flex-wrap: wrap;
  }

  .papers {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 0;
    padding: 0;
    margin: 0;
  }

  .swatch {
    display: block;
    position: relative;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--swatch);
    border: 3px solid rgb(255 255 255 / 0.6);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
    cursor: pointer;
    transition: border-color 0.15s ease;
  }

  .swatch:has(input:checked) {
    border-color: var(--color-ink);
  }

  .swatch:has(input:focus-visible) {
    outline: 2px solid var(--color-ink);
    outline-offset: 2px;
  }

  .swatch input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .acts {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ghost {
    border: 0;
    background: transparent;
    font-family: var(--font-hand);
    font-size: 20px;
    color: var(--color-ink);
    opacity: 0.7;
    text-decoration: underline;
    cursor: pointer;
    padding: 4px;
  }

  .ghost:hover {
    opacity: 1;
  }

  .pill {
    border: 0;
    border-radius: 999px;
    background: var(--color-ink);
    color: #fffef5;
    font-family: var(--font-hand);
    font-weight: 600;
    font-size: 21px;
    padding: 6px 22px 8px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.25);
    transition: background 0.15s ease;
  }

  .pill:hover:not(:disabled) {
    background: oklch(0.24 0.015 80);
  }

  .pill:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .close:focus-visible,
  .ghost:focus-visible,
  .pill:focus-visible {
    outline: 2px solid var(--color-ink);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .close,
    .swatch,
    .pill {
      transition: none;
    }
  }
</style>
