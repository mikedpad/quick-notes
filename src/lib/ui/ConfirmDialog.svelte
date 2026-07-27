<script lang="ts">
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

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
  class="dialog animate-dialog card bg-surface-100-900 border-surface-200-800 w-[min(26rem,calc(100vw-2rem))]
         max-w-none border shadow-2xl"
  aria-labelledby={titleId}
  data-confirm-dialog
  onclose={() => (open = false)}
>
  <header class="flex items-start gap-3">
    <div class="preset-tonal-warning btn-icon shrink-0" aria-hidden="true">
      <TriangleAlert size={18} />
    </div>
    <div>
      <h2 id={titleId} class="h6 font-bold">{title}</h2>
      <p class="text-surface-700-300 mt-1 text-sm">{message}</p>
    </div>
  </header>

  <footer class="flex justify-end gap-2">
    <button type="button" class="btn preset-tonal" onclick={() => (open = false)}>
      {cancelLabel}
    </button>
    <button
      type="button"
      class="btn {destructive ? 'preset-filled-error-500' : 'preset-filled-primary-500'}"
      onclick={confirm}
    >
      {confirmLabel}
    </button>
  </footer>
</dialog>
