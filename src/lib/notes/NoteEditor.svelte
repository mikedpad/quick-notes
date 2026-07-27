<script lang="ts">
  import { untrack } from 'svelte';
  import { Tabs } from '@skeletonlabs/skeleton-svelte';
  import Eye from '@lucide/svelte/icons/eye';
  import PenLine from '@lucide/svelte/icons/pen-line';
  import X from '@lucide/svelte/icons/x';
  import ConfirmDialog from '$lib/ui/ConfirmDialog.svelte';
  import { renderMarkdown } from '$lib/notes/markdown';
  import { EMPTY_DRAFT, validateDraft, type NoteDraft } from '$lib/domain/note';

  type Props = {
    open: boolean;
    /** Absent for a new note; supplied when editing an existing one. */
    draft?: NoteDraft;
    title?: string;
    submitLabel?: string;
    onsubmit: (draft: NoteDraft) => void | Promise<void>;
  };

  let {
    open = $bindable(false),
    draft = EMPTY_DRAFT,
    title = 'Add note',
    submitLabel = 'Add note',
    onsubmit,
  }: Props = $props();

  let dialog = $state<HTMLDialogElement>();
  let values = $state<NoteDraft>({ ...EMPTY_DRAFT });
  let submitted = $state(false);
  let saving = $state(false);
  let tab = $state('write');
  let confirmingDiscard = $state(false);

  // Seed the form on the closed→open transition, so a cancelled edit doesn't
  // leak into the next one. `draft` is read untracked: reacting to it as well
  // would reset the form mid-edit if the underlying note changed.
  $effect(() => {
    if (!open) return;
    untrack(() => {
      values = { ...draft };
      submitted = false;
      tab = 'write';
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
  const dirty = $derived(values.title !== draft.title || values.body !== draft.body);
  const preview = $derived(renderMarkdown(values.body));

  /** Unsaved work is only ever discarded after asking. */
  function requestClose() {
    if (dirty) confirmingDiscard = true;
    else open = false;
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
  class="dialog animate-dialog card bg-surface-100-900 border-surface-200-800 w-[min(42rem,calc(100vw-2rem))]
         max-w-none border p-0 shadow-2xl"
  aria-label={title}
  oncancel={event => {
    // Escape: route through the same guard as the close button.
    event.preventDefault();
    requestClose();
  }}
>
  <form onsubmit={handleSubmit} class="flex max-h-[85vh] flex-col">
    <header class="border-surface-200-800 flex items-center justify-between gap-4 border-b p-4">
      <h2 class="h5 font-bold">{title}</h2>
      <button
        type="button"
        class="btn-icon btn-icon-sm preset-tonal"
        aria-label="Close"
        onclick={requestClose}
      >
        <X size={18} aria-hidden="true" />
      </button>
    </header>

    <div class="flex-1 space-y-4 overflow-y-auto p-4">
      <label class="label">
        <span class="label-text">Title</span>
        <input
          name="title"
          class="input"
          class:border-error-500={submitted && errors.title}
          placeholder="What is this note about?"
          bind:value={values.title}
          aria-invalid={submitted && errors.title ? 'true' : undefined}
          aria-describedby={submitted && errors.title ? 'title-error' : undefined}
        />
        {#if submitted && errors.title}
          <span id="title-error" class="text-error-500 text-sm">{errors.title}</span>
        {/if}
      </label>

      <Tabs value={tab} onValueChange={event => (tab = event.value)}>
        <div class="flex items-center justify-between gap-4">
          <span class="label-text">Contents</span>
          <Tabs.List class="preset-filled-surface-200-800 rounded-container inline-flex gap-1 p-1">
            <Tabs.Trigger
              value="write"
              class="btn btn-sm gap-2 data-selected:preset-filled-primary-500"
            >
              <PenLine size={14} aria-hidden="true" /> Write
            </Tabs.Trigger>
            <Tabs.Trigger
              value="preview"
              class="btn btn-sm gap-2 data-selected:preset-filled-primary-500"
            >
              <Eye size={14} aria-hidden="true" /> Preview
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="write" class="mt-2">
          <textarea
            name="body"
            class="textarea min-h-56 font-mono text-sm"
            class:border-error-500={submitted && errors.body}
            placeholder="Markdown is supported — **bold**, # headings, - lists, `code`"
            bind:value={values.body}
            aria-invalid={submitted && errors.body ? 'true' : undefined}
            aria-describedby={submitted && errors.body ? 'body-error' : undefined}></textarea>
          {#if submitted && errors.body}
            <span id="body-error" class="text-error-500 text-sm">{errors.body}</span>
          {/if}
        </Tabs.Content>

        <Tabs.Content value="preview" class="mt-2">
          <div
            class="note-prose border-surface-200-800 rounded-container min-h-56 overflow-y-auto
                   border p-3 text-sm"
          >
            {#if preview}
              <!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitised in markdown.ts -->
              {@html preview}
            {:else}
              <p class="text-surface-600-400 italic">Nothing to preview yet.</p>
            {/if}
          </div>
        </Tabs.Content>
      </Tabs>
    </div>

    <footer class="border-surface-200-800 flex justify-end gap-2 border-t p-4">
      <button type="button" class="btn preset-tonal" onclick={requestClose}>Cancel</button>
      <button type="submit" class="btn preset-filled-primary-500" disabled={saving}>
        {saving ? 'Saving…' : submitLabel}
      </button>
    </footer>
  </form>
</dialog>

<ConfirmDialog
  bind:open={confirmingDiscard}
  title="Discard changes?"
  message="This note has edits that have not been saved. Closing now will lose them."
  confirmLabel="Discard"
  destructive
  onconfirm={() => (open = false)}
/>
