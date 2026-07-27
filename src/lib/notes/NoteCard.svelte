<script lang="ts">
  import Pencil from '@lucide/svelte/icons/pencil';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { renderMarkdown } from '$lib/notes/markdown';
  import { wall } from '$lib/state/wall.svelte';
  import { paperAt, paperVars, scatterAt } from '$lib/ui/paper';
  import { paperIndex, type Note } from '$lib/domain/note';

  type Props = {
    note: Note;
    /**
     * Where on the wall this note hangs. Decides how crookedly it is stuck up,
     * and — for notes written before colours existed — which paper it is on.
     */
    index: number;
    onedit?: (note: Note) => void;
    ondelete?: (note: Note) => void;
  };

  let { note, index, onedit, ondelete }: Props = $props();

  const paper = $derived(paperAt(paperIndex(note, index)));
  const scatter = $derived(scatterAt(index, wall.scatter));
  const body = $derived(renderMarkdown(note.body));

  const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
  const stamp = $derived(note.updatedAt !== note.createdAt ? note.updatedAt : note.createdAt);

  /**
   * Double-click opens the note, the way double-clicking anything else on a
   * desktop opens it. Single clicks stay inert, so the wall can still be read
   * without setting anything off, and the pencil remains the discoverable —
   * and keyboard-reachable — way in.
   */
  function open(event: MouseEvent) {
    // A double-click that landed on the edit or delete button is that button's
    // business; it has already acted on the first click.
    if ((event.target as HTMLElement).closest('button')) return;
    // Double-clicking selects the word under the cursor. Nothing is going to
    // read that selection, and it flashes behind the dialog as it opens.
    getSelection()?.removeAllRanges();
    onedit?.(note);
  }
</script>

<!-- Double-click is a pointer shortcut layered on top of the pencil button,
     which stays the keyboard- and screen-reader-reachable way in. -->
<article
  class="note"
  style="{paperVars(
    paper,
  )} --rotate: {scatter.rotate}deg; --drop: {scatter.drop}px; --zoom: {wall.zoom};"
  ondblclick={onedit ? open : undefined}
>
  {#if wall.taped}
    <span class="tape" style="--rotate: {scatter.tapeRotate}deg" aria-hidden="true"></span>
  {/if}

  {#if onedit || ondelete}
    <!-- Actions stay quiet until the note is hovered, but focus reveals them
         too, so they remain reachable by keyboard. -->
    <div class="actions">
      {#if onedit}
        <button
          type="button"
          class="action"
          aria-label="Edit note"
          title="Edit note"
          onclick={() => onedit(note)}
        >
          <Pencil size={15} aria-hidden="true" />
        </button>
      {/if}
      {#if ondelete}
        <button
          type="button"
          class="action destructive"
          aria-label="Delete note"
          title="Delete note"
          onclick={() => ondelete(note)}
        >
          <Trash2 size={15} aria-hidden="true" />
        </button>
      {/if}
    </div>
  {/if}

  <h2>{note.title}</h2>

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitised in markdown.ts -->
  <div class="body note-prose">{@html body}</div>

  <time datetime={stamp}>{dateFormat.format(new Date(stamp))}</time>
</article>

<style>
  /**
   * A square of paper: lit along the top edge, flat through the middle, and
   * shaded where the sheet below it starts. The near-square corner radius is
   * what keeps it paper rather than a card.
   */
  .note {
    position: relative;
    aspect-ratio: 1 / 1;
    background: linear-gradient(
      178deg,
      var(--paper-light) 0%,
      var(--paper-base) 26%,
      var(--paper-base) 78%,
      var(--paper-shade) 100%
    );
    border-radius: 1px 1px 2px 2px;
    padding: 44px 20px 16px;
    display: flex;
    flex-direction: column;
    color: var(--color-ink);
    transform: rotate(var(--rotate)) translateY(var(--drop));
    box-shadow: var(--shadow-note);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease;
  }

  /* Straightens, lifts and floats over its neighbours. */
  .note:hover {
    transform: rotate(0deg) translateY(calc(var(--drop) - 4px)) scale(var(--zoom));
    box-shadow: var(--shadow-note-lifted);
    z-index: 10;
  }

  .tape {
    position: absolute;
    top: -11px;
    left: 50%;
    width: 96px;
    height: 26px;
    margin-left: -48px;
    background: rgb(250 246 228 / 0.55);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
    transform: rotate(var(--rotate));
  }

  .actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .note:hover .actions,
  .actions:focus-within {
    opacity: 1;
  }

  .action {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.45);
    color: var(--color-ink);
    cursor: pointer;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
    transition: background 0.15s ease;
  }

  .action:hover {
    background: rgb(255 255 255 / 0.8);
  }

  .action.destructive {
    color: var(--color-crimson);
  }

  .action:focus-visible {
    outline: 2px solid var(--color-ink);
    outline-offset: 2px;
  }

  h2 {
    margin: 0 0 6px;
    font-family: var(--font-hand);
    font-weight: 700;
    font-size: 25px;
    line-height: 1.05;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /**
   * A note holds what a note holds. Rather than scroll — nobody scrolls a
   * Post-It — the text runs out under a fade, and the whole thing is one click
   * away from being opened properly.
   */
  .body {
    flex: 1;
    overflow: hidden;
    font-size: 13.5px;
    font-weight: 300;
    line-height: 1.42;
    -webkit-mask-image: linear-gradient(180deg, black 62%, transparent 97%);
    mask-image: linear-gradient(180deg, black 62%, transparent 97%);
  }

  time {
    align-self: flex-end;
    font-family: var(--font-hand);
    font-size: 16px;
    opacity: 0.78;
    transform: rotate(-1deg);
    padding-top: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    .note,
    .actions,
    .action {
      transition: none;
    }

    /* The lift is the affordance; the zoom is the flourish. */
    .note:hover {
      transform: rotate(0deg) translateY(calc(var(--drop) - 4px));
    }
  }
</style>
