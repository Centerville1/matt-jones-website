<script>
  // import global styles on all pages.
  import '../global.css';
  import ModeSwitcher from './modeSwitcher.svelte';
  import { onMount } from 'svelte';
  // svelte-media-query docs: https://www.npmjs.com/package/svelte-media-query
  import MediaQuery from 'svelte-media-query';
  import Footer from './footer.svelte';

  // Toggle visibility of the mobile nav dropdown menu
  function toggleNav() {
    if (document.getElementById('links')?.style.display == 'none') {
      document.getElementById('links').style.display = 'flex';
      return;
    }
    closeNav();
  }

  // Close (remove visibility of) the mobile nav dropdown menu
  function closeNav() {
    document.getElementById('links').style.display = 'none';
  }

  // Add a listener to close the nav when a click occurs outside of it.
  onMount(() => {
    document.onclick = function (e) {
      if (window.screen.width <= 439) {
        let menu_icon_box = document.getElementById('links');
        let button = document.getElementById('menu-button');
        if (!menu_icon_box.contains(e.target) && !button.contains(e.target)) {
          closeNav();
        }
      }
    };
  });
</script>

<div id="page">
  <header>
    <img id="logo" src="/logo.png" alt="Matt Jones Software Developer, logo" />
    <ModeSwitcher />
    <MediaQuery query="(min-width: 440px)" let:matches>
      {#if matches}
        <div id="links">
          <a class="plain" href="/">Home</a>
          <a class="plain" href="/about">About</a>
          <a class="emphasis" href="/projects">Projects</a>
        </div>
      {:else}
        <button id="menu-button" on:click={toggleNav}>
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 18L20 18"
              stroke="var(--contrast-text-light)"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M4 12L20 12"
              stroke="var(--contrast-text-light)"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M4 6L20 6"
              stroke="var(--contrast-text-light)"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <nav id="links">
          <div>
            <a on:click={toggleNav} href="/">Home</a>
          </div>
          <div>
            <a on:click={toggleNav} href="/projects">Projects</a>
          </div>
          <div>
            <a on:click={toggleNav} href="/about">About</a>
          </div>
        </nav>
      {/if}
    </MediaQuery>
  </header>
  <main>
    <div id="page-content">
      <slot />
    </div>
    <Footer />
  </main>
</div>

<style>
  #page {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background-color: var(--neutral-gray);
    color: var(--contrast-text-light);
  }

  header {
    width: 100vw;
    height: 60px;
    background-color: var(--neutral-white);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  #logo {
    width: 50px;
    height: 50px;
    margin-left: 10px;
  }

  @media (min-width: 440px) {
    #links {
      margin-right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-weight: bold;
      font-size: larger;
    }

    #links a {
      width: 100px;
      display: flex;
      justify-content: center;
      text-decoration: none;
      margin-left: 10px;
    }

    .emphasis {
      transition: background 0.5s;
      padding: 7px 20px 7px 20px;
      background-color: var(--main-blue);
      color: var(--contrast-text-dark);
      border-radius: 10px;
    }

    .emphasis:hover {
      background-color: var(--main-blue-alt);
      color: var(--contrast-text-dark);
    }

    .plain {
      color: var(--contrast-text-light);
    }

    .plain:hover {
      color: var(--main-blue-light);
    }
  }

  @media (max-width: 439px) {
    #menu-button {
      background-color: transparent;
      padding: 0;
    }

    nav {
      position: absolute;
      right: 0;
      top: 60px;
      z-index: 1;
      height: 200px;
      width: 200px;
      /* starts hidden */
      display: none;
      flex-direction: column;
      justify-content: space-around;
      background-color: var(--neutral-white);
      border-left: 1px solid black;
      border-bottom: 1px solid var(--contrast-text-light);
      border-radius: 5px;
    }

    nav div {
      width: 100%;
      height: 33%;
    }

    nav div:hover {
      background-color: var(--neutral-gray);
    }

    nav div a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: x-large;
      font-weight: bold;
      color: var(--contrast-text-light);
      text-decoration: none;
      border-bottom: 0.5px solid var(--contrast-text-light);
    }
  }

  main {
    position: absolute;
    height: calc(100vh - 60px);
    width: 100vw;
    overflow: scroll;
    overflow-x: hidden;
  }

  #page-content {
    min-height: 80vh;
    width: 100vw;
  }
</style>
