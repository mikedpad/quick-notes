<script lang="ts">
  /**
   * A modal confirmation, replacing `window.confirm`.
   *
   * Domain-free: it knows nothing about notes, only about asking a question and
   * reporting the answer. Nesting inside another modal is supported — the
   * browser stacks `showModal()` dialogs, so the editor can ask before
   * discarding while it is itself open.
   */
  type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Styles the confirm button as destructive. */
    destructive?: boolean;
    onconfirm: () => void;
  };

  let {
    open = $bindable(false),
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
    onconfirm,
  }: Props = $props();

  let dialog = $state<HTMLDialogElement>();

  // More than one of these can be mounted at once — the editor has its own
  // discard guard while the page has a delete guard — so the heading id has to
  // be per-instance, or `aria-labelledby` resolves to the wrong dialog.
  const titleId = $props.id();

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });

  function confirm() {
    open = false;
    onconfirm();
  }
</script>

<dialog
  bind:this={dialog}
  aria-labelledby={titleId}
  data-confirm-dialog
  onclose={() => (open = false)}
>
  <!-- A small pink one, torn off and stuck up in front of everything else. -->
  <div class="sheet">
    <span class="tape" aria-hidden="true"></span>

    <h2 id={titleId}>{title}</h2>
    <p>{message}</p>

    <div class="acts">
      <button type="button" class="ghost" onclick={() => (open = false)}>{cancelLabel}</button>
      <button type="button" class="pill" class:destructive onclick={confirm}>
        {confirmLabel}
      </button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    border: 0;
    padding: 0;
    background: none;
    max-width: none;
    /* Tailwind's preflight zeroes every margin, including the `auto` a modal
       <dialog> is centred by. Putting it back is the whole centring. */
    margin: auto;
    overflow: visible;
    color: var(--color-ink);
  }

  dialog::backdrop {
    background: rgb(48 40 24 / 0.45);
    backdrop-filter: blur(2px);
  }

  .sheet {
    position: relative;
    width: min(20rem, calc(100vw - 2rem));
    background: linear-gradient(
      178deg,
      oklch(0.91 0.08 356) 0%,
      oklch(0.88 0.09 356) 26%,
      oklch(0.83 0.1 354) 100%
    );
    transform: rotate(1deg);
    box-shadow:
      0 3px 6px rgb(0 0 0 / 0.15),
      0 20px 32px -12px rgb(0 0 0 / 0.45);
    padding: 32px 26px 22px;
  }

  .tape {
    position: absolute;
    top: -12px;
    left: 50%;
    width: 100px;
    height: 26px;
    margin-left: -50px;
    background: rgb(250 246 228 / 0.6);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
    transform: rotate(2deg);
  }

  h2 {
    margin: 0 0 6px;
    font-family: var(--font-hand);
    font-weight: 700;
    font-size: 28px;
    line-height: 1.05;
  }

  p {
    margin: 0;
    font-size: 13.5px;
    font-weight: 300;
    line-height: 1.45;
  }

  .acts {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;
    margin-top: 20px;
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

  .pill.destructive {
    background: var(--color-crimson);
    color: #fff6f2;
  }

  .pill:hover {
    background: oklch(0.24 0.015 80);
  }

  .pill.destructive:hover {
    background: oklch(0.4 0.16 28);
  }

  .ghost:focus-visible,
  .pill:focus-visible {
    outline: 2px solid var(--color-ink);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .pill {
      transition: none;
    }
  }
</style>
