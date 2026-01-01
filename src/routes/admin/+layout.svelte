<script>
  import { page } from '$app/stores';

  /** @type {import('./$types').LayoutData} */
  export let data;

  let showMobileMenu = false;

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }
</script>

{#if data.user}
  <div class="admin-layout">
    <header>
      <div class="header-content">
        <h1>Admin Panel</h1>
        <div class="header-actions">
          <button class="menu-toggle" on:click={toggleMobileMenu}> ☰ </button>
          <a href="/admin/logout" class="logout-button">Logout</a>
        </div>
      </div>
    </header>

    <div class="content-wrapper">
      <nav class:show={showMobileMenu}>
        <ul>
          <li class:active={$page.url.pathname === '/admin'}>
            <a href="/admin">Dashboard</a>
          </li>
          <li class:active={$page.url.pathname.startsWith('/admin/portfolio')}>
            <a href="/admin/portfolio">Portfolio Items</a>
          </li>
          <li class:active={$page.url.pathname === '/admin/blog' && !$page.url.pathname.includes('/tags') && !$page.url.pathname.includes('/series')}>
            <a href="/admin/blog">Blog Posts</a>
          </li>
          <li class:active={$page.url.pathname.startsWith('/admin/blog/tags')}>
            <a href="/admin/blog/tags" class="sub-nav">Tags</a>
          </li>
          <li class:active={$page.url.pathname.startsWith('/admin/blog/series')}>
            <a href="/admin/blog/series" class="sub-nav">Series</a>
          </li>
          <li class:active={$page.url.pathname.startsWith('/admin/bios')}>
            <a href="/admin/bios">Bios</a>
          </li>
          <li class:active={$page.url.pathname.startsWith('/admin/images')}>
            <a href="/admin/images">Images</a>
          </li>
          <li class:active={$page.url.pathname.startsWith('/admin/files')}>
            <a href="/admin/files">Files</a>
          </li>
          <li class:active={$page.url.pathname.startsWith('/admin/contact')}>
            <a href="/admin/contact">Contact Submissions</a>
          </li>
        </ul>
      </nav>

      <main>
        <slot />
      </main>
    </div>
  </div>
{:else}
  <slot />
{/if}

<style>
  .admin-layout {
    min-height: 100vh;
    background-color: var(--neutral-gray);
    color: var(--neutral-black);
  }

  header {
    background-color: var(--neutral-dark-gray);
    border-bottom: 2px solid var(--neutral-dark-gray-op-50);
    padding: 20px;
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: var(--main-blue-light);
  }

  .header-actions {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--neutral-black);
    font-size: 24px;
    cursor: pointer;
    padding: 5px 10px;
  }

  .logout-button {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 8px 16px;
    border-radius: 10px;
    text-decoration: none;
    transition: background-color 0.5s;
  }

  .logout-button:hover {
    background-color: var(--main-blue-alt);
  }

  .content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    gap: 20px;
    padding: 20px;
  }

  nav {
    width: 200px;
    background-color: var(--neutral-dark-gray);
    border-radius: 10px;
    padding: 20px 0;
    height: fit-content;
    position: sticky;
    top: 20px;
  }

  nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  nav li {
    margin: 0;
  }

  nav a {
    display: block;
    padding: 12px 20px;
    color: var(--neutral-black);
    text-decoration: none;
    transition: background-color 0.2s;
  }

  nav a.sub-nav {
    padding-left: 35px;
    font-size: 0.9em;
  }

  nav a:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  nav li.active a {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
  }

  main {
    flex: 1;
    background-color: var(--neutral-dark-gray);
    border-radius: 10px;
    padding: 30px;
    min-height: 400px;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    .content-wrapper {
      flex-direction: column;
    }

    nav {
      display: none;
      width: 100%;
      position: static;
    }

    nav.show {
      display: block;
    }
  }
</style>
