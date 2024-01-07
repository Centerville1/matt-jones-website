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
    <a href="https://www.linkedin.com/in/matt-jones-a7b389292/" class="link">
      <Icon width={60} height={60} icon={'linkedin'} />
      <span>LinkedIn</span>
    </a>
    {#if mode === 'dark'}
      <a href="https://github.com/Centerville1" class="link">
        <img id="github" src="/github-dark.png" alt="Github logo" />
        <span>Github</span>
      </a>
    {:else}
      <a href="https://github.com/Centerville1" class="link">
        <img id="github" src="/github.png" alt="Github logo" />
        <span>Github</span>
      </a>
    {/if}
    <a href="mailto:matt.jones3054@gmail.com" class="link">
      <Icon width={60} height={60} icon={'email'} />
      <span>matt.jones3054@gmail.com</span>
    </a>
    <div id="copyright">
      © Copyright 2024 Matthew A. Jones All Rights Reserved
    </div>
  </div>
</footer>

<style>
  footer {
    height: 470px;
    width: 100vw;
    background-color: var(--neutral-dark-gray);
  }

  .container {
    height: calc(100% - 20px);
    padding: 20px 20px 0px 20px;
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

  .link {
    width: fit-content;
    padding: 15px 100px 15px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--main-blue);
    font-size: x-large;
  }

  #github {
    width: 60px;
    height: 60px;
  }

  @media (min-width: 440px) {
    .link span {
      overflow: visible;
      text-wrap: nowrap;
      padding-left: 30px;
      font-weight: bold;
      color: inherit;
    }

    #copyright {
      margin-left: auto;
      height: 10%;
      display: flex;
      align-items: end;
      width: fit-content;
      color: var(--contrast-text-light);
      font-size: medium;
    }
  }
  @media (max-width: 439px) {
    .link span {
      overflow: visible;
      text-wrap: nowrap;
      padding-left: 10px;
      font-size: inherit;
      font-weight: bold;
      color: inherit;
    }

    .link:last-of-type {
      font-size: small;
    }

    #copyright {
      margin-left: auto;
      height: 10%;
      display: flex;
      align-items: end;
      width: fit-content;
      color: var(--neutral-white);
      font-size: xx-small;
    }
  }

  .link:hover {
    transition: 0.5s;
    color: var(--main-blue-alt);
    background-color: var(--neutral-gray-op-10);
    border-radius: 10px;
  }
</style>
