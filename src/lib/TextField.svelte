<script lang="ts">
  import debounce from 'lodash.debounce';
  export let label;
  export let required = false;
  let validated = false;
  const id = `tf-${label}`;
</script>

<div>
  <input type="text" {id} placeholder=" " />
  <label for={id}
    >{label}
    {#if required}<span class="asterisk">*</span>{/if}
  </label>
  <span class="helper" class:error={!validated}>{label} is required</span>
</div>

<style>
  div {
    position: relative;
  }
  input {
    background-color: var(--alice-blue);
    border-radius: 4px;
    border: 0;
    border-bottom: 1px solid var(--bdazzled-blue);
    font-size: 20px;
    width: 100%;
    padding: 24px 0 4px 16px;
    line-height: 1;
    margin: 16px 0 32px;
    outline: none;
  }
  label {
    position: absolute;
    top: 38px;
    left: 16px;
    font-size: 20px;
    line-height: 0.65;
    color: var(--bdazzled-blue);
    pointer-events: none;
    transform-origin: 0 50%;
    transition: transform 200ms, color 200ms;
  }
  .asterisk {
    color: var(--burnt-sienna);
  }
  /* .helper {
    position: absolute;
    bottom: 12px;
    left: 16px;
    font-size: 12px;
    color: var(--bdazzled-blue);
  }
  .helper.error {
    color: var(--burnt-sienna);
  } */

  /* Input is focused */
  input:focus {
    border-bottom: 2px solid var(--bdazzled-blue);
    padding: 24px 0 3px 16px;
  }
  input:focus ~ label,
  input:not(:placeholder-shown) ~ label {
    transform: translateY(-14px) scale(0.6);
  }
  /* Input is focused, and NO text is present */
  input:focus ~ label {
    /* color: var(--tf-label-color-inactive); */
    color: var(--burnt-sienna);
  }
  /* Input is focused, and text is present */
  input:not(:placeholder-shown) ~ label {
    color: var(--bdazzled-blue);
  }
  input:not(:placeholder-shown) ~ label span {
    color: transparent;
  }
</style>
