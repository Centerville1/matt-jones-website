<script>
  import Highlighted from './highlighted.svelte';
  import Timeline from './timeline.svelte';
  import Experiments from './experiments.svelte';
  import { page } from '$app/stores';

  let animateRight = true;

  /**
   * @param {{ currentTarget: { value: string; }; }} event
   */
  function onTabChange(event) {
    animateRight = true;
    let target = event?.currentTarget.value;
    let current = window.location.hash;
    if (current==="#highlighted" && target==="timeline") {
      animateRight = false;
    }
    else if (current==="#other") {
      animateRight = false;
    }
    let page = document.getElementById("tab-content");
    // @ts-ignore
    page.style.transition="transform 0.8s cubic-bezier(1,-0.3,0.9,0.5)";
    if (animateRight) {
      // @ts-ignore
      page.style.transform="translateX(-100vw)";
    }
    else {
      // @ts-ignore
      page.style.transform="translateX(100vw)";
    }
    let main = document.getElementsByTagName("main")[0];
    main?.scrollTo({top: 0, behavior: "smooth"});
    
    setTimeout(() => {changeTab(target)}, 800);
  }

  /**
   * @param {string} target
   */
  function changeTab(target) {
    window.location.hash = target;
    let page = document.getElementById("tab-content");
    // @ts-ignore
    page.style.transition="transform 0s";
    if (animateRight) {
      // @ts-ignore
      page.style.transform="translateX(100vw)";
    }
    else {
      // @ts-ignore
      page.style.transform="translateX(-100vw)";
    }
    let main = document.getElementsByTagName("main")[0];
    main?.scrollTo({top: 0, behavior: "smooth"});
    setTimeout(() => {animateEnd()}, 20)
  }

  function animateEnd() {
    let page = document.getElementById("tab-content");
    // @ts-ignore
    page.style.transition="transform 0.5s cubic-bezier(0,0,.3,1.3)";
    // @ts-ignore
    page.style.transform="translateX(0)";
    let main = document.getElementsByTagName("main")[0];
    main?.scrollTo({top: 0, behavior: "smooth"});
    setTimeout(() => {resetTranslation()}, 500)
  }

  // Needed to keep position:fixed working on nav bar
  function resetTranslation() {
    let page = document.getElementById("projects-page");
    // @ts-ignore
    page.style = "";
  }
</script>

<div id="projects-page">
  <nav>
    <hr>
    <form>
      <div class="tab">
        <input
          type="radio"
          id="timeline"
          value="timeline"
          checked={$page.url.hash !== '#highlighted' &&
          $page.url.hash !== '#other'}
          on:change={onTabChange}
        />
        <label for="timeline">Timeline</label>
      </div>
      <div class="tab">
        <input
          type="radio"
          id="highlighted"
          value="highlighted"
          checked={$page.url.hash === '#highlighted'}
          on:change={onTabChange}
        />
        <label for="highlighted">Highlights</label>
      </div>
      <div class="tab">
        <input
          type="radio"
          id="other"
          value="other"
          checked={$page.url.hash === '#other'}
          on:change={onTabChange}
        />
        <label for="other">Experiments</label>
      </div>
    </form>
    <div class="transition"></div>
  </nav>
  <div id="tab-content">
    {#if $page.url.hash === '#other'}
      <Experiments />
    {:else if $page.url.hash === '#highlighted'}
      <Highlighted />
    {:else if $page.url.hash !== '#highlighted' &&
    $page.url.hash !== '#other'}
      <Timeline />
    {/if}
  </div>
</div>

<style>
  @keyframes move-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100vw);
    }
  }

  /* Background pattern originally generated from 
  https://www.magicpattern.design/tools/css-backgrounds */
  #projects-page {
    width: 450vw;
    padding-left: 220vw;
    margin-left: -220vw;
    min-height: 100vh;
    overflow: auto;
    background:
      radial-gradient(
        circle,
        transparent 20%,
        var(--neutral-gray) 20%,
        var(--neutral-gray) 80%,
        transparent 80%,
        transparent
      ),
      radial-gradient(
          circle,
          transparent 20%,
          var(--neutral-gray) 20%,
          var(--neutral-gray) 80%,
          transparent 80%,
          transparent
        )
        32.5px 32.5px,
      linear-gradient(var(--neutral-dark-gray-op-50) 2.6px, transparent 2.6px) 0 -1.3px,
      linear-gradient(
          90deg,
          var(--neutral-dark-gray-op-50) 2.6px,
          var(--neutral-gray) 2.6px
        ) -1.3px 0;
    background-size:
      65px 65px,
      65px 65px,
      32.5px 32.5px,
      32.5px 32.5px;
  }

  nav {
    width: 450vw;
    padding-left: 220vw;
    margin-left: -220vw;
    background-color: var(--neutral-dark-gray);
    position: fixed;
    z-index: 10;
  }

  hr {
    padding-left: 220vw;
    margin-left: -220vw;
    border-color: var(--neutral-black);
    margin-top: 0;
  }

  .transition {
    padding-left: 220vw;
    margin-left: -220vw;
    width: 450vw;
    height: 10px;
    background: var(--neutral-gray);
  }

  nav form {
    padding-left: 220vw;
    margin-left: -220vw;
    min-width: fit-content;
    width: fit-content;
    margin-right: auto;
    display: flex;
    justify-content: center;
    width: 40vw;
    border-radius: 10px;
  }

  .tab label {
    display: block;
    border-left: 2px var(--neutral-gray) solid;
    border-right: 2px var(--neutral-gray) solid;
    padding: 5px 10px 5px 10px;
    margin: 0px 5px 0px 5px;
    transition: background-color 0.5s;
    border-radius: 10px 10px 0 0;
  }

  .tab label:hover {
    background-color: var(--neutral-gray-op-50);
  }

  .tab input[type='radio'] {
    height: 0;
    position: absolute;
  }

  /* Detect tab focus on input */
  .tab input[type='radio']:focus + label {
    border: 2px solid var(--main-blue);
  }

  .tab input[type='radio']:checked + label {
    background: var(--neutral-gray);
  }

  .tab label {
    cursor: pointer;
    z-index: 90;
    line-height: 1.8em;
  }

  #tab-content {
    width: 100vw;
    margin-top: 59px;
    height: fit-content;
    overflow: auto;
  }
</style>
