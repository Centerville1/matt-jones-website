<script>
  import Highlighted from './highlighted.svelte';
  import Timeline from './timeline.svelte';
  import Experiments from './experiments.svelte';
  import { page } from '$app/stores';

  /**
   * @param {{ currentTarget: { value: string; }; }} event
   */
  function onTabChange(event) {
    window.location.hash = event?.currentTarget.value;
  }
</script>

<div id="page">
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
  /* Background pattern originally generated from 
  https://www.magicpattern.design/tools/css-backgrounds */
  #page {
    width: 100vw;
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
    width: 100vw;
    background-color: var(--neutral-dark-gray);
    position: fixed;
    z-index: 1;
  }

  hr {
    border-color: var(--neutral-black);
    margin-top: 0;
  }

  .transition {
    width: 100%;
    height: 10px;
    background: var(--neutral-gray);
  }

  nav form {
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
    display: none;
  }

  .tab input[type='radio']:checked + label {
    background: var(--neutral-gray);
    border-radius: 10px 10px 0 0;
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
