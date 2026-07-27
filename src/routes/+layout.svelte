<script lang="ts">
  import type { Snippet } from 'svelte';
  import NotebookPen from '@lucide/svelte/icons/notebook-pen';
  import '../styles/app.css';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <header
    class="preset-filled-surface-100-900 border-surface-200-800 sticky top-0 z-10 border-b
           backdrop-blur"
  >
    <div class="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
      <NotebookPen size={22} class="text-primary-500" aria-hidden="true" />
      <h1 class="h5 font-bold tracking-tight">Quick Notes</h1>
    </div>
  </header>

  <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
    {@render children()}
  </main>
</div>
