<script lang="ts">
  import Note from '$lib/Note.svelte';

  const title = 'Card Title Goes Here';
  const content = `This is the first of many notes. Not sure how these are going to look with a lot of text, but it will be interesting once we start creating large numbers of notes with fake data.`;
</script>

<Note {title} {content} />
