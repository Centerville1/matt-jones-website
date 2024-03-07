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
  <div id="top-menu">
    <form>
      <div class="tab">
        <input
          type="radio"
          id="highlighted"
          value="highlighted"
          checked={$page.url.hash !== '#timeline' &&
            $page.url.hash !== '#other'}
          on:change={onTabChange}
        />
        <label for="highlighted">Highlights</label>
      </div>
      <div class="tab">
        <input
          type="radio"
          id="timeline"
          value="timeline"
          checked={$page.url.hash === '#timeline'}
          on:change={onTabChange}
        />
        <label for="timeline">Timeline</label>
      </div>
      <div class="tab">
        <input
          type="radio"
          id="other"
          value="other"
          checked={$page.url.hash === '#other'}
          on:change={onTabChange}
        />
        <label for="other">Other</label>
      </div>
    </form>
  </div>
  <hr />
  <div id="tab-content">
    {#if $page.url.hash === '#other'}
      <Experiments />
    {:else if $page.url.hash === '#timeline'}
      <Timeline />
    {:else}
      <Highlighted />
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

  #top-menu {
    width: 100vw;
  }

  #top-menu form {
    min-width: 270px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 50vw;
    border-radius: 10px;
    border: 1px solid;
    border-color: var(--main-blue-light);
  }

  .tab label {
    display: block;
    padding: 5px 10px 5px 10px;
    margin: 0px 5px 0px 5px;
    transition: background-color 0.5s;
    border-radius: 5px;
  }

  .tab label:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  .tab input[type='radio'] {
    display: none;
  }

  .tab input[type='radio']:checked + label {
    background: var(--main-blue-alt);
    border-radius: 4px;
  }

  .tab label {
    cursor: pointer;
    z-index: 90;
    line-height: 1.8em;
  }

  hr {
    border-color: var(--neutral-gray);
  }

  #tab-content {
    width: 100vw;
    height: fit-content;
    overflow: auto;
  }
</style>
