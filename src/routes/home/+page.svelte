<script>
  import Bio from './bio.svelte';
</script>

<div id="page">
  <div id="text-container">
    <h1>About Me</h1>
    <Bio />
  </div>
</div>

<style>
  #page {
    width: 100vw;
    min-height: 100vh;
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

  #text-container {
    width: 80vw;
    margin-top: 30px;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
  }
</style>
