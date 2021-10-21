<script lang="ts">
  import fingerprint from '$images/fingerprint.svg';

  const items = [
    {
      icon: fingerprint,
      text: `Add note`,
    },
    {
      icon: fingerprint,
      text: `Generate Notes`,
    },
    {
      icon: fingerprint,
      text: `Save All Notes`,
    },
    {
      icon: fingerprint,
      text: `Load All Notes`,
    },
  ];

  export let open = false;
</script>

<div role="presentation" class:open={'drawer-root'}>
  <div class="modal-backdrop" aria-hidden="true" />
  <div class="drawer" tabindex="-1">
    <div role="presentation" class="drawer-inner">
      <div class="drawer-header">
        <button class="menu-button" tabindex="0" type="button" aria-label="close drawer">
          <span class="MuiIconButton-label">
            <svg
              class="svg-icon"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </span>
        </button>
        <h1 class="menu-title">Quick Notes</h1>
      </div>
      <nav class="menu-nav">
        {#each items as { text, icon }, i}
          <div class="menu-item" tabindex={i} role="button" aria-disabled="false">
            <div class="menu-item-icon">
              <img
                src={icon}
                class="svg-icon"
                role="presentation"
                aria-hidden="true"
                alt="Fingerprint"
                width={24}
                height={24}
              />
            </div>
            <div class="menu-item-text"><span>{text}</span></div>
          </div>
        {/each}
      </nav>
    </div>
  </div>
</div>

<style lang="scss">
  .drawer-root {
    position: fixed;
    z-index: 1300;
    inset: 0px;
  }
  .modal-backdrop {
    // MuiBackdrop-root
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: -1;
    position: fixed;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
  }

  .drawer {
    // MuiDrawer-paperAnchorLeft
    left: 0;
    right: auto;
    // MuiDrawer-paper
    top: 0;
    flex: 1 0 auto;
    height: 100%;
    display: flex;
    outline: 0;
    z-index: 1200;
    position: fixed;
    overflow-y: auto;
    flex-direction: column;
    // MuiPaper-elevation16
    box-shadow: 0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%),
      0px 6px 30px 5px rgb(0 0 0 / 12%);
    // MuiPaper-root
    color: rgba(0, 0, 0, 0.87);
    background-color: #eee;
  }
  .drawer-inner {
    width: 256px;
  }
  .drawer-header {
    // MuiToolbar-regular
    min-height: 64px;
    // MuiToolbar-gutters
    padding-left: 24px;
    padding-right: 24px;
    // MuiToolbar-root
    display: flex;
    position: relative;
    align-items: center;
  }
  .menu-button {
    margin-right: 8px;
    // MuiIconButton-colorInherit
    color: inherit;
    // MuiIconButton-edgeStart
    margin-left: -12px;
    // MuiIconButton-root
    flex: 0 0 auto;
    padding: 12px;
    overflow: visible;
    font-size: 1.5rem;
    text-align: center;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 50%;
    // MuiButtonBase-root
    border: 0;
    cursor: pointer;
    margin: 0;
    display: inline-flex;
    outline: 0;
    position: relative;
    align-items: center;
    user-select: none;
    border-radius: 0;
    vertical-align: middle;
    justify-content: center;
    text-decoration: none;
    background-color: transparent;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  .menu-title {
    flex-grow: 1;
    font-size: 1.75rem;
    font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
    // MuiTypography-h1
    font-weight: 300;
    line-height: 1.167;
  }
  .menu-nav {
    // MuiList-padding
    padding-top: 8px;
    padding-bottom: 8px;
    // MuiList-root
    margin: 0;
    padding: 0;
    position: relative;
    list-style: none;
  }
  .menu-item {
    padding: 8px;
    // MuiListItem-button
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    // MuiListItem-root
    width: 100%;
    display: flex;
    position: relative;
    box-sizing: border-box;
    text-align: left;
    align-items: center;
    justify-content: flex-start;
    text-decoration: none;
    // MuiButtonBase-root
    color: inherit;
    border: 0;
    cursor: pointer;
    margin: 0;
    outline: 0;
    padding: 0;
    user-select: none;
    border-radius: 0;
    vertical-align: middle;
    background-color: transparent;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  /* .menu-divider {
    border: none;
    height: 1px;
    margin: 0;
    flex-shrink: 0;
    background-color: rgba(0, 0, 0, 0.12);
  } */
  .menu-item-icon {
    padding: 0px 16px 0px 8px;
    min-width: 0;
    // MuiListItemIcon-root
    color: rgba(0, 0, 0, 0.54);
    display: inline-flex;
    flex-shrink: 0;
  }
  .menu-item-text {
    margin: 0;
    // MuiListItemText-root
    flex: 1 1 auto;
    min-width: 0;

    & span {
      // MuiTypography-body1
      font-size: 1rem;
      font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-weight: 400;
      line-height: 1.5;
      // MuiTypography-root
      margin: 0;
    }
  }
  .svg-icon {
    fill: currentColor;
    /* width: 1em;
    height: 1em; */
    display: inline-block;
    font-size: 1.5rem;
    /* transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; */
    flex-shrink: 0;
    user-select: none;
  }
</style>
