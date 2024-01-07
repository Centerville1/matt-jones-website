<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import Bio from './bio.svelte';
  import Icons from '../icons.svelte';
  import { themeMode } from '../../store';

  let bioHeight = 0;

  $: updateBioHeight(bioHeight);

  onMount(() => {
    updateBioHeight(0);
  });

  /**
   * @type {string}
   */
  let mode;

  themeMode.subscribe((value) => {
    mode = value;
  });

  let iconSize = 30;

  /**
   * @param { number} height
   */
  function updateBioHeight(height) {
    if (!browser) return;
    let box = document.getElementById('bio-box');
    if (box !== null) {
      box.style.height = '' + (height + 100) + 'px';
    }
  }
</script>

<div id="page">
  <div id="text-container">
    <div id="bio-box" class="text-box">
      <h1>Hi there!</h1>
      <Bio bind:height={bioHeight} />
    </div>
    <div class="text-box">
      <h1>So What's Here</h1>
      <p>On this site you can find:</p>
      <ul>
        <a href="/home/projects"><li>my projects</li></a>
        <li>things I've worked on</li>
        <li>companies I've worked for</li>
        <li>people I've worked with</li>
      </ul>
      <p>
        It's also a place for me to build future projects off of, and somewhere
        I can put my experiments with webdev.
      </p>
    </div>
    <div class="text-box">
      <h1>Socials</h1>
      <a href="https://www.linkedin.com/in/matt-jones-a7b389292/" class="link">
        <Icons width={iconSize} height={iconSize} icon={'linkedin'} />
        <span>LinkedIn</span>
      </a>
      {#if mode === 'dark'}
        <a href="https://github.com/Centerville1" class="link">
          <img src="/github-dark.png" alt="Github logo" />
          <span>Github</span>
        </a>
      {:else}
        <a href="https://github.com/Centerville1" class="link">
          <img src="/github.png" alt="Github logo" />
          <span>Github</span>
        </a>
      {/if}
      <a href="mailto:matt.jones3054@gmail.com" class="link">
        <img src="/instagram.png" alt="Instagram logo" />
        <span>Instagram</span>
      </a>
      <a href="mailto:matt.jones3054@gmail.com" class="link">
        <img src="/soundcloud.png" alt="Soundcloud logo" />
        <span>Soundcloud</span>
      </a>
      <a href="mailto:matt.jones3054@gmail.com" class="link">
        <Icons width={iconSize} height={iconSize} icon={'email'} />
        <span>matt.jones3054@gmail.com</span>
      </a>
    </div>
  </div>
</div>

<style>
  #page {
    width: 100vw;
    min-height: 80vh;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    /* Background pattern originally generated from 
  https://www.magicpattern.design/tools/css-backgrounds */
    background: repeating-linear-gradient(
      45deg,
      var(--neutral-dark-gray-op-10),
      var(--neutral-dark-gray-op-10) 5px,
      var(--no-background) 5px,
      var(--no-background) 12px
    );
  }

  a {
    transition: background-color 0.5s;
    border-radius: 10px;
    color: var(--main-blue);
  }

  a:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  @media screen and (max-width: 440px) {
    #text-container {
      width: 100vw;
      margin-top: 30px;
      overflow: hidden;
      margin-left: auto;
      margin-right: auto;
    }
  }
  @media screen and (min-width: 441px) {
    #text-container {
      width: 80vw;
      margin-top: 30px;
      overflow: hidden;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .text-box {
    border: 3px solid var(--neutral-dark-gray-op-50);
    border-radius: 20px;
    padding: 2vw;
    margin-bottom: 10px;
    overflow: hidden;
    transition: height 3s cubic-bezier(0.3, 0.3, 0.27, 1);
  }

  .link {
    width: fit-content;
    padding: 10px;
    margin: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--main-blue);
    font-size: medium;
  }

  .link span {
    margin-left: 5px;
  }

  .link img {
    width: 30px;
    height: 30px;
  }
</style>
