<script lang="ts">
</script>

<header>
  <h1>Quick Notes</h1>
</header>
<main>
  <slot />
</main>
<footer>
  <p>The ever-important foot of the document.</p>
</footer>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap');
  @import 'normalize.css/normalize.css';
  @import 'cssVars';

  :root {
    background-color: var(--bgColor);
    background-size: cover;
    font-family: var(--default-font);
    color: var(--color);
  }
</style>
