<script lang="ts">
  import { page } from '$app/stores';
  import {
    Header,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    SideNav,
    SideNavItems,
    SideNavLink,
    SideNavDivider,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    Link,
  } from 'carbon-components-svelte';
  import { DocumentAdd32, Layers32, Save32, Upload32 } from 'carbon-icons-svelte';

  let currentPath = $page.path;

  const items = ['Add', 'Generate', 'Save', 'Load'];
  const icons = [DocumentAdd32, Layers32, Save32, Upload32];
  const navItems = items.map((text, i) => {
    const href = `/${text.toLowerCase()}`;
    const isSelected = href === currentPath;
    return { text, href, icon: icons[i], isSelected };
  });

  let isSideNavOpen = false;
</script>

<Header platformName="Quick Notes" href="/" bind:isSideNavOpen expandedByDefault={false}>
  <HeaderNav>
    {#each navItems as { text, href, icon, isSelected }}
      <HeaderNavItem {text} {href} {isSelected} />
    {/each}
  </HeaderNav>
  <SideNav fixed bind:isOpen={isSideNavOpen}>
    <SideNavItems>
      {#each navItems as { text, href, icon, isSelected }}
        <SideNavLink {text} {href} {icon} {isSelected} />
      {/each}
    </SideNavItems>
  </SideNav>
</Header>
