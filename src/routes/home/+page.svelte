<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import Bio from './bio.svelte';
  import Icons from '../icons.svelte';
  import { themeMode } from '../../store';
  import notesJSON from './notes.json';

  let bioHeight = 0;

  $: updateBioHeight(bioHeight);

  onMount(() => {
    updateBioHeight(0);
    context = new AudioContext();
  });

  /**
   * @type {AudioContext}
   */
  let context;

  function playRandomNote() {
    let notes = [
      notesJSON.C4,
      notesJSON.C5,
      notesJSON.E4,
      notesJSON.E3,
      notesJSON.G4,
      notesJSON.G3,
    ];

    playNote(notes[Math.round(Math.random() * (notes.length - 1))], 1);
  }

  /**
   * @param {number} frequency
   * @param {number} duration
   */
  function playNote(frequency, duration) {
    // Original audio example
    // https://marcgg.com/blog/2016/11/01/javascript-audio/
    if (!browser) return;
    let sound = context.createOscillator();
    sound.frequency.value = frequency;
    let gain = context.createGain();
    sound.type = 'sine';
    sound.connect(gain);
    sound.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = 0.1;
    sound.start();
    gain.gain.exponentialRampToValueAtTime(
      0.00001,
      context.currentTime + duration,
    );
    sound.stop(context.currentTime + duration);
  }

  // if (browser) {
  //   document.onmousemove = (event) => {
  //     let stickers = document.getElementsByClassName('sticker')[0];
  //     let images = document.getElementsByTagName('img');
  //     for (let i = 0; i < images.length; i++) {
  //       let image = images[i];
  //       if (image.parentElement?.parentElement === stickers) {
  //         let multiplier = -0.01;
  //         image.style.top =
  //           (event.clientY - window.innerHeight / 2) * (multiplier * i) + 'px';
  //         image.style.left =
  //           (event.clientX - window.innerWidth / 2) * ((multiplier * 1) / i) +
  //           'px';
  //       }
  //     }
  //   };
  // }

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
  <div class="sticker">
    <span id="lego-wave">
      <img
        src="/stickers/lego.gif"
        alt="waving lego minifigure with cool sunglasses"
      />
    </span>
    <span id="piano">
      <img src="/stickers/piano.png" alt="A grand piano" />
    </span>
    <span id="capsule">
      <img src="/stickers/orion.png" alt="An orion space capsule" />
    </span>
  </div>
  <div id="text-container">
    <div id="bio-box" class="text-box">
      <h1>Hi there!</h1>
      <Bio bind:height={bioHeight} onButtonClick={playRandomNote} />
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
      <a
        href="https://www.linkedin.com/in/matt-jones-a7b389292/"
        class="link"
        on:click={playRandomNote}
      >
        <Icons width={iconSize} height={iconSize} icon={'linkedin'} />
        <span>LinkedIn</span>
      </a>
      {#if mode === 'dark'}
        <a
          href="https://github.com/Centerville1"
          class="link"
          on:click={playRandomNote}
        >
          <img src="/social-logos/github-dark.png" alt="Github logo" />
          <span>Github</span>
        </a>
      {:else}
        <a
          href="https://github.com/Centerville1"
          class="link"
          on:click={playRandomNote}
        >
          <img src="/social-logos/github.png" alt="Github logo" />
          <span>Github</span>
        </a>
      {/if}
      <a
        href="https://www.instagram.com/centermattjones/?hl=en"
        class="link"
        on:click={playRandomNote}
      >
        <img src="/social-logos/instagram.png" alt="Instagram logo" />
        <span>Instagram</span>
      </a>
      <a
        href="https://soundcloud.com/centermatt"
        class="link"
        on:click={playRandomNote}
      >
        <img src="/social-logos/soundcloud.png" alt="Soundcloud logo" />
        <span>Soundcloud</span>
      </a>
      <a
        href="mailto:matt.jones3054@gmail.com"
        class="link"
        on:click={playRandomNote}
      >
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
    transition: 0.5s;
    border-radius: 10px;
    color: var(--main-blue);
  }

  a:hover {
    color: var(--main-blue-light);
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
    .sticker {
      display: none;
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

    .sticker {
      position: absolute;
      width: 7vw;
      height: 7vw;
      opacity: 0.5;
    }

    .sticker span img {
      position: relative;
      width: inherit;
      height: inherit;
    }

    @keyframes jiggle {
      20% {
        margin-top: 5px;
      }
      50% {
        margin-top: -5px;
      }
      80% {
        margin-top: 5px;
      }
    }

    .sticker span:hover {
      animation-name: jiggle;
      animation-duration: 0.5s;
      animation-timing-function: ease;
      animation-iteration-count: 1;
    }

    #lego-wave {
      position: absolute;
      top: 20vh;
      transform: rotateZ(5deg);
      height: inherit;
      width: inherit;
    }

    #piano {
      position: absolute;
      left: 91vw;
      top: 40vh;
      transform: rotateZ(-10deg);
      height: inherit;
      width: inherit;
    }

    #capsule {
      position: absolute;
      top: 80vh;
      left: 1vw;
      transform: rotateZ(-10deg);
      height: inherit;
      width: inherit;
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
