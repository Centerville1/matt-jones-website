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

<div id="background-{instance}" class="background">
  {#if onClick !== ""}
    <div class="popup">
      <button class="close" on:click={closeBox}>&times;</button>
      <button class="content" on:click={onClick} style="cursor: pointer;">
        <h4><i>Click to Visit Page</i></h4>
        <slot />
      </button>
    </div>
  {:else}
    <div class="popup">
      <button class="close" on:click={closeBox}>&times;</button>
      <slot />
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
  width: 90%;
  height: 100%;
  min-height: 300px;
  border-radius: 0;
}

.popup :global(button) {
  color: var(--contrast-text-light)
}

</style>