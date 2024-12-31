<script>
  import Icon from '../icons.svelte';
  import { themeMode } from '../../store';

  /**
   * @type {string}
   */
  let mode;

  themeMode.subscribe((value) => {
    mode = value;
  });

  function scroll_top() {
    let main = document.getElementsByTagName("main")[0];
    main.scrollTo({top:0})
  }
</script>

<footer>
  <div class="container">
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
    </header>
    <hr />
    <div class="contact">
      <div class="contact-title">
        <h2>Matt Jones</h2>
        <h3>Inquiries?  Contact me:</h3>
      </div>
      <h3>Email: <a href="mailto:matt.jones3054@gmail.com" class="inline-link">matt.jones3054@gmail.com</a></h3>
    </div>
    <div class="horizontal-divider" />
    <div class="navigation">
      <h3><i>Site Navigation and Info</i></h3>
      <div class="navigation-layout">
        <div class="links">
          <h2>Pages</h2>
          <h3>
            <a href="/home" class="inline-link" on:click={scroll_top}>
              Home
            </a>
          </h3>
          <h3>
            <a href="/home/projects" class="inline-link" on:click={scroll_top}>
              All Experience
            </a>
          </h3>
          <h3>
            <a href="/home/projects#other" class="inline-link" on:click={scroll_top}>
              Web Creations
            </a>
          </h3>
        </div>
        <div class="links">
          <h2>About</h2>
          <h3>
            <a href="/home/about" class="inline-link" on:click={scroll_top}>
              About Site
            </a>
          </h3>
          <h3>
            <a href="/home/architecture" class="inline-link" on:click={scroll_top}>
              Tech Stack
            </a>
          </h3>
        </div>
      </div>
      <hr />
      <div id="github-link">
        <h3>Check out the project on: </h3>
        {#if mode === 'dark'}
          <a href="https://github.com/Centerville1/matt-jones-website" class="link">
            <img
              id="github"
              src="/social-logos/github-dark.png"
              alt="Github logo"
            />
            <span>Github</span>
          </a>
        {:else}
          <a href="https://github.com/Centerville1" class="link">
            <img id="github" src="/social-logos/github.png" alt="Github logo" />
            <span>Github</span>
          </a>
        {/if}
      </div>
    </div>

    <div id="copyright">
      © 2023 - 2024 Matthew A. Jones All Rights Reserved
    </div>
  </div>
</footer>

<style>
  footer {
    height: fit-content;
    width: 100vw;
    background-color: var(--neutral-dark-gray);
    position: relative;
  }

  .container {
    height: calc(100% - 20px);
    padding-top: 20px;
    overflow: hidden;
  }

  header {
    width: 100%;
    height: 110px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  #logo {
    width: 100px;
    height: 100px;
    margin-left: 10px;
  }

  hr {
    width: 75%;
    border: none;
    border-top: 0.5px solid var(--neutral-black);
  }

  .contact {
    width: 100vw;
    border-top: 3px solid var(--neutral-gray-op-50);
    border-bottom: 3px solid var(--neutral-gray-op-50);
    padding: 20px 0 10px 20px;
    margin-top: 30px;
  }

  .contact-title {
    display: flex;
    align-items: center;
    flex-direction: column;

    & h2, & h3  {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }

  .inline-link {
    color: var(--main-blue);
    transition: color 0.5s;

    &:hover {
      color: var(--main-blue-light);
    }
  }

  .horizontal-divider {
    margin-top: 50px;
    border: 3px solid var(--main-blue-light);
  }

  .navigation {
    overflow: hidden; 
    margin-left: 30px;
    padding-left: 40px;
    border-left: 6px solid var(--main-blue-light);

    & h3:first-child {
      margin-bottom: 0;
      margin-left: 5px;
    }

    & hr {
      width: 90%;
      margin-left: 0;
    }
  }

  .navigation-layout {
    display: flex;
    flex-direction: row;
    margin-left: 5px;
  }

  .links {
    margin-right: 30px;
  }

  .link {
    width: fit-content;
    padding: 15px 100px 15px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--main-blue);
    font-size: x-large;
    transition: 0.5s;
  }

  #github-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;
    
    & h3 {
      margin: 0;
    }
  }

  #github {
    width: 40px;
    height: 40px;
  }

  #copyright {
    margin-left: auto;
    margin-right: 12px;
    height: 10%;
    display: flex;
    align-items: end;
    width: fit-content;
    color: var(--contrast-text-light);
    font-size: medium;
  }
  
  .link span {
    overflow: visible;
    text-wrap: nowrap;
    padding-left: 10px;
    font-weight: bold;
    color: inherit;
  }

  @media (max-width: 439px) {
    #copyright {
      font-size: x-small;
    }

    #github-link {
      flex-direction: column;
      align-items: flex-start;
    }

    .navigation-layout {
      flex-direction: column;
    }
  }

  .link:hover {
    color: var(--main-blue-light);
    background-color: var(--neutral-gray-op-10);
    border-radius: 10px;
  }
</style>
