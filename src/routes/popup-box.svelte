<script context="module">
  let instances = 0;
</script>

<script>
  export let onClick;

  instances += 1;
  let instance = instances;

  export function openPopup() {
    // Get the box
    var modal = document.getElementById("background-"+instance);
    if (modal !== null) {
      modal.style.display = "block";
    }
  }

  function closeBox() {
    // Get the modal
    var modal = document.getElementById("background-"+instance);
    if (modal !== null) {
      modal.style.display = "none";
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="background-{instance}" class="background" on:click={closeBox} title="Close Popup">
  {#if onClick !== ""} 
  <!-- If the popup has an onclick action to perform -->
    <div class="popup">
      <button class="close" on:click={closeBox}>&times;</button>
      <button class="content" on:click={onClick} style="cursor: pointer;" title="Click to Visit">
        <slot />
      </button>
      <h4><i>Click again to Visit Page</i></h4>
    </div>
  {:else}
    <div class="popup">
      <button class="close" on:click={closeBox}>&times;</button>
      <button class="content">
        <slot />
      </button>
    </div>
  {/if}
</div>

<style>
.background {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  left: 0px;
  top: 0px;
  width: 100vw; /* Full width */
  height: 100vh; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: var(--neutral-dark-gray-op-10); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

.popup {
  background-color: var(--neutral-dark-gray);
  border-radius: 10px;
  margin: 8%; /* 15% from the top and centered */
  padding: 2%;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  background-color: var(--no-background);
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.content {
  background-color: var(--no-background);
  height: 100%;
  min-height: 50vh;
  max-height: 90vh;
  width: 100%;
  border-radius: 0;
  overflow-y: auto;
  transition: none;
}

.content:hover {
  background-color: var(--neutral-gray-op-10);
  border-radius: 15px;
}

h4 {
  margin: 0 0 5px;
}

.popup :global(button) {
  color: var(--contrast-text-light)
}

</style>