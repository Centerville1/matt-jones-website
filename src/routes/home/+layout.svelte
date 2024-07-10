<script>
  // import global styles on all pages.
  import '../../global.css';
  // import ThemeSwitch from './themeSwitch.svelte';
  import { onMount } from 'svelte';
  // svelte-media-query docs: https://www.npmjs.com/package/svelte-media-query
  import MediaQuery from 'svelte-media-query';
  import Footer from './footer.svelte';
  import { themeMode, animatePageLoadLocalStorageKey } from '../../store';

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

  function scrollTop() {
    let main = document.getElementsByTagName('main')[0];
    if (main !== null) {
      main.scrollTop = 0;
    }
  }

  // Add a listener to close the mobile nav when a click occurs outside of it.
  onMount(() => {
    // remove scroll-up animation if we aren't coming from the
    // sphere loader page (prevents animation playing on reload)
    let animatePageLoad = localStorage.getItem(animatePageLoadLocalStorageKey)
    if (animatePageLoad === "true") {
      localStorage.setItem(animatePageLoadLocalStorageKey, "false")
    }
    else {
      document.getElementById('outer-container').style.animation = 'none'
    }
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

  /**
   * @type {string}
   */
  let mode;

  themeMode.subscribe((value) => {
    mode = value;
  });
</script>

<div id="outer-container"></div>
<div id="page">
  <header>
    {#if mode === 'dark'}
      <img
        id="logo"
        src="/logo-light-nbg.png"
        alt="Matt Jones Software Developer, logo"
      />
    {:else}
      <img
        id="logo"
        src="/logo-light.png"
        alt="Matt Jones Software Developer, logo"
      />
    {/if}
    <MediaQuery query="(min-width: 440px)" let:matches>
      {#if matches}
        <div id="links">
          <a class="plain" href="/home" on:click={scrollTop}>Home</a>
          <a
            class="emphasis"
            href="/home/projects"
            on:click={scrollTop}>Projects</a
          >
        </div>
      <!-- Change to hamburger menu on small screens -->
      {:else}
        <button id="menu-button" on:click={toggleNav}>
          <!-- Hamburger menu icon SVG -->
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
            <a on:click={toggleNav} href="/home">Home</a>
          </div>
          <div>
            <a on:click={toggleNav} href="/home/projects">Projects</a>
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
  #outer-container {
    width: 100vw;
    background-color: var(--neutral-gray);
    z-index: 2;
    animation: move-up 1.7s cubic-bezier(0.34, 0.13, 0.06, 0.96) both;;
  }

  @keyframes move-up {
    0% {
      height: 100vh;
    }
    100% {
      height: 0vh;
    }
  }

  #page {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background-color: var(--neutral-gray);
    color: var(--contrast-text-light);
    --header-width: 60px;
  }

  header {
    width: 100vw;
    height: var(--header-width);
    background-color: var(--neutral-dark-gray);
    display: flex;
    flex-direction: row;
    align-items: center;
    box-shadow: 0px -55px 300px 40px var(--constant-black);
    z-index: 1;
  }

  #logo {
    width: 50px;
    height: 50px;
    margin-left: 10px;
  }

  /* width */
  main::-webkit-scrollbar {
    width:11px;
  }

  /* Track */
  main::-webkit-scrollbar-track {
    background: var(--no-background);
  }

  /* Handle */
  main::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, var(--no-background), var(--main-blue-light));
    border-radius:10px;
  }

  /* Handle on hover */
  main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, var(--no-background), var(--main-blue));
  }

  /* CSS on large screens */
  @media (min-width: 440px) {
    #links {
      margin-right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-weight: bold;
      font-size: larger;
      z-index: 99;
    }

    #links a {
      width: 100px;
      display: flex;
      justify-content: center;
      text-decoration: none;
      margin-left: 10px;
    }

    .emphasis {
      padding: 7px 20px 7px 20px;
      background-color: var(--main-blue-light);
      color: var(--contrast-text-light);
      border-radius: 10px;
      transition: background 0.5s;
    }

    .emphasis:hover {
      background-color: var(--main-blue);
      color: var(--contrast-text-light);
    }

    .plain {
      color: var(--contrast-text-light);
    }

    .plain:hover {
      color: var(--main-blue-light);
    }
  }

  /* CSS for small screens */
  @media (max-width: 439px) {
    #menu-button {
      background-color: transparent;
      padding: 0;
    }

    nav {
      position: absolute;
      top: var(--header-width);
      z-index: 99;
      height: fit-content;
      width: 200px;
      /* starts hidden */
      display: none;
      flex-direction: column;
      justify-content: space-around;
      background-color: var(--main-blue-alt);
      border-bottom: 1px solid var(--contrast-text-light);
      border-radius: 5px;
    }

    nav div {
      width: 100%;
      height: 33%;
    }

    nav div:hover {
      background-color: var(--main-blue-light);
    }

    nav div a {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: x-large;
      font-weight: bold;
      color: var(--contrast-text-light);
      text-decoration: none;
      border-top: 0.5px solid var(--contrast-text-light);
    }
  }

  main {
    position: absolute;
    top: var(--header-width);
    height: calc(100vh - var(--header-width));
    width: 100vw;
    overflow: scroll;
    overflow-x: hidden;
  }

  #page-content {
    min-height: 80vh;
    width: 100vw;
  }
</style>
