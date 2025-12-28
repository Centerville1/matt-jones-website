<script>
  import { page } from '$app/stores';
</script>

<div id="page">
  <div id="error-page">
    {#if $page.status == 404}
      <h1>{$page.status} {$page.error?.message}</h1>
      <hr />
      <h2>Sorry, but that page doesn't exist! ¯\_(ツ)_/¯</h2>
      <p>
        <i>If you think there should be a page here</i>: let me know what went
        wrong at my
        <a
          class="inline-anchor"
          href="https://github.com/Centerville1/matt-jones-website/issues"
          >github repo</a
        >, and I'll try to fix the issue!
      </p>
      <a class="button" href="/home">Return Home</a>
    {:else if $page.status === 500}
      <h1>{$page.status} {$page.error?.message}</h1>
      <p>Guess I messed up...</p>
      <h1>🤦</h1>
      <hr />
      <p>
        Please let me know what went wrong on my <a
          class="inline-anchor"
          href="https://github.com/Centerville1/matt-jones-website/issues"
          >github repo</a
        > and I'll try to fix the issue!
      </p>
      <a class="button" href="/home">Return Home</a>
    {:else}
      <h1>{$page.status}</h1>
      <p>{$page.error?.message}</p>
    {/if}
  </div>
</div>

<style>
  #page {
    height: 100vh;
    width: 90vw;
    max-width: 700px;
    padding-left: 20px;
    background-color: var(--neutral-gray);
    overflow: hidden;
  }

  #error-page {
    padding: 10px;
    color: var(--contrast-text-light);
  }

  .button {
    display: block;
    border-radius: 10px;
    margin-top: 40px;
    padding: 10px;
    height: fit-content;
    width: fit-content;
    color: var(--contrast-text-light);
    background-color: var(--main-blue-light);
    transition: background 0.5s;
  }

  .button:hover {
    background-color: var(--main-blue-alt);
    color: var(--contrast-text-light);
  }

  .inline-anchor:visited {
    color: var(--main-blue);
  }
</style>
