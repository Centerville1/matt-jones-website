<script>
  import { page } from '$app/stores';
</script>

<div id="error-page">
  {#if $page.status == 404}
    <h2>Oops, silly, that page doesn't exist! ¯\_(ツ)_/¯</h2>
    <a href="/">Return Home</a>
  {:else}
    <h1>{$page.status}</h1>
    <p>{$page.error?.message}</p>
  {/if}
</div>

<style>
  #error-page {
    padding-left: 10px;
  }
</style>
