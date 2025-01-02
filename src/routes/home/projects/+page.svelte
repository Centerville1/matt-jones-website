<script>
  import Timeline from './timeline.svelte';
  import Experiments from './experiments.svelte';
  import Projects from './projects.svelte';
  import { page } from '$app/stores';

  let animateRight = true;

  /**
   * @param {{ currentTarget: { value: string; }; }} event
   */
  function onTabChange(event) {
    animateRight = true;
    let target = event?.currentTarget.value;
    let current = window.location.hash;
    if (current==="#timeline" && target==="projects") {
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
    let page = document.getElementById("tab-content");
    // @ts-ignore
    page.style = "";
  }
</script>

<div id="projects-page">
  <nav>
    <hr>
    <form>
      <div class="title"><h3>My Portfolio:</h3></div>
      <div class="tabs">
        <div class="tab">
          <input
            type="radio"
            id="projects"
            value="projects"
            checked={$page.url.hash !== "#timeline" && $page.url.hash !== '#other'}
            on:change={onTabChange}
          />
          <label for="projects">Projects</label>
        </div>
        <div class="tab">
          <input
            type="radio"
            id="timeline"
            value="timeline"
            checked={$page.url.hash === '#timeline'}
            on:change={onTabChange}
          />
          <label for="timeline">My Experience</label>
        </div>
        <div class="tab">
          <input
            type="radio"
            id="other"
            value="other"
            checked={$page.url.hash === '#other'}
            on:change={onTabChange}
          />
          <label for="other">Creations</label>
        </div>
      </div>
    </form>
    <div class="transition" />
  </nav>
  <div id="tab-content">
    {#if $page.url.hash === '#other'}
      <Experiments />
    {:else if $page.url.hash === "#timeline"}
      <Timeline />
    {:else if $page.url.hash !== "#timeline" && $page.url.hash !== '#other'}
      <Projects />
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
        var(--neutral-white) 20%,
        var(--neutral-white) 80%,
        transparent 80%,
        transparent
      ),
      radial-gradient(
          circle,
          transparent 20%,
          var(--neutral-white) 20%,
          var(--neutral-white) 80%,
          transparent 80%,
          transparent
        )
        30px 30px,
      linear-gradient(var(--neutral-dark-gray-op-50) 2.6px, transparent 2.6px) 0 -1.3px,
      linear-gradient(
          90deg,
          var(--neutral-dark-gray-op-50) 2.6px,
          var(--neutral-white) 2.6px
        ) -1.3px 0;
    background-size:
      60px 60px,
      60px 60px,
      30px 30px,
      30px 30px;
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

  .title {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
  }

  .title h3 {
    margin: 0;
    height: fit-content;
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
    width: 40vw;
    border-radius: 10px;
  }

  .tabs {
    display: flex;
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
