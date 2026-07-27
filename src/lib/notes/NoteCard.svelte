<script lang="ts">
  import Pencil from '@lucide/svelte/icons/pencil';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { renderMarkdown } from '$lib/notes/markdown';
  import type { Note } from '$lib/domain/note';

  type Props = {
    note: Note;
    onedit?: (note: Note) => void;
    ondelete?: (note: Note) => void;
  };

  let { note, onedit, ondelete }: Props = $props();

  const body = $derived(renderMarkdown(note.body));

  const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
  const edited = $derived(note.updatedAt !== note.createdAt);
  const stamp = $derived(edited ? note.updatedAt : note.createdAt);
</script>

<article
  class="card preset-filled-surface-50-950 border-surface-200-800 group flex h-64 flex-col
         overflow-hidden border transition-shadow hover:shadow-lg"
>
  <header class="flex items-start justify-between gap-2 px-4 pt-3">
    <h2 class="h6 line-clamp-2 leading-snug font-bold">{note.title}</h2>

    {#if onedit || ondelete}
      <!-- Actions stay quiet until the card is hovered, but focus reveals them
           too, so they remain reachable by keyboard. -->
      <div
        class="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100
               focus-within:opacity-100"
      >
        {#if onedit}
          <button
            type="button"
            class="btn-icon btn-icon-sm preset-tonal hover:preset-tonal-primary"
            aria-label="Edit note"
            title="Edit note"
            onclick={() => onedit(note)}
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
        {/if}
        {#if ondelete}
          <button
            type="button"
            class="btn-icon btn-icon-sm preset-tonal hover:preset-tonal-error"
            aria-label="Delete note"
            title="Delete note"
            onclick={() => ondelete(note)}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        {/if}
      </div>
    {/if}
  </header>

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitised in markdown.ts -->
  <div class="note-prose flex-1 overflow-y-auto px-4 py-2 text-sm">{@html body}</div>

  <footer class="text-surface-600-400 px-4 pb-3 text-xs">
    <time datetime={stamp}>
      {edited ? 'Edited' : 'Created'}
      {dateFormat.format(new Date(stamp))}
    </time>
  </footer>
</article>
