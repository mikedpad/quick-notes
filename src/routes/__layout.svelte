<script lang="ts">
  import { Content, Grid, Row, Column } from 'carbon-components-svelte';
  import Header from '$lib/Header.svelte';
  import 'carbon-components-svelte/css/g90.css';
</script>

<Header />
<Content>
  <Grid>
    <Row>
      <Column>
        <slot />
      </Column>
    </Row>
  </Grid>
</Content>
