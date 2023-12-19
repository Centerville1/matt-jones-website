<script>
  // import global styles on all pages.
  import '../global.css'

  // svelte-media-query docs: https://www.npmjs.com/package/svelte-media-query

</script>

<div id="page">
  <nav>
    <div id="logo">
      logo
    </div>
    <div id="links">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/projects">Projects</a>
    </div>
  </nav>
  <main>
    <div id="page-content">
      <slot></slot>
    </div>
    <footer>

    </footer>
  </main>
</div>

<style>
  #page {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background-color: var(--neutral-gray);
  }

  nav {
    width: 100vw;
    height: 60px;
    background-color: var(--neutral-white);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  #logo {
    background-color: var(--red);
    width: 40px;
    height: 40px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white
  }

  #links {
    margin-right: 10px;

  }

  main {
    position: absolute;
    height: calc(100vh - 60px);
    width: 100vw;
    overflow: scroll;
  }

  #page-content {
    min-height: 80vh;
  }

  footer {
    height: 300px;
    width: 100%;
    background-color: var(--neutral-brown);
  }
</style>
