<script>
  import { page } from '$app/stores';
</script>

<div id="page">
  <div id="error-page">
    {#if $page.status == 404}
      <h2>Oops, silly, that page doesn't exist! ¯\_(ツ)_/¯</h2>
      <a href="/home">Return Home</a>
    {:else}
      <h1>{$page.status}</h1>
      <p>{$page.error?.message}</p>
    {/if}
  </div>
</div>

<style>
  #page {
    height: 100vh;
    width: 100vw;
    background-color: var(--neutral-gray);
    overflow: hidden;
  }

  #error-page {
    padding-left: 10px;
    color: var(--contrast-text-light);
  }
</style>
