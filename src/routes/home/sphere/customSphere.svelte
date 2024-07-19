<script>
  import { onMount } from 'svelte';
  import Sphere from './sphere.svelte';

  let longitudeLines = 9,
    latitudeLines = 5,
    diameter = 290,
    animationSpeed = 30,
    animationSpeedSteps = 300,
    color = 0,
    animate = true,
    rotateX = 30,
    rotateY = 30,
    rotateZ = 30;

  let colors = [
    { title: 'Light Blue', variable: '--main-blue-light' },
    { title: 'Red', variable: '--red' },
    { title: 'Green', variable: '--green' },
    { title: 'Purple', variable: '--contrast-purple' },
    { title: 'White', variable: '--neutral-black' },
    { title: 'Dark Blue', variable: '--logo-blue' },
    { title: 'Black', variable: '--neutral-white' },
  ];
</script>

<div id="page">
  <div class="text">
    <h3>CSS 3D Wireframe Sphere</h3>
    <p>Remember the sphere from the intro animation?  Well, it was actually rendered
      using CSS, and here you can play around with it!  (read <strong>implementation</strong> below)
    </p>
    <p>Try messing with the sliders below!</p>
  </div>
  <hr />
  <div class="slider-container">
    <div>
      <label for="animate">Play Animation:</label>
      <input
      id="animate"
      type="checkbox"
      bind:checked={animate} />
    </div>
    <div>
      <label for="speed">Rotation Speed</label>
      <input
        type="range"
        min="1"
        max={animationSpeedSteps}
        class="slider"
        id="speed"
        bind:value={animationSpeed}
      />
    </div>
    <div>
      <label for="diam">Diameter: {diameter}px</label>
      <input
        type="range"
        min="10"
        max="700"
        step="10"
        class="slider"
        id="diam"
        bind:value={diameter}
      />
    </div>
    <div>
      <label for="long">Longitude Lines: {longitudeLines}</label>
      <input
        type="range"
        min="1"
        max="50"
        step="2"
        class="slider"
        id="long"
        bind:value={longitudeLines}
      />
    </div>
    <div>
      <label for="lat">Latitude Lines: {latitudeLines}</label>
      <input
        type="range"
        min="1"
        max="50"
        class="slider"
        id="lat"
        bind:value={latitudeLines}
      />
    </div>
    <div>
      <label for="color">Color: {colors[color].title}</label>
      <input
        type="range"
        min="0"
        max={colors.length - 1}
        class="slider"
        id="color"
        bind:value={color}
      />
    </div>
    {#if !animate}
    <div>
      <label for="rotateX">Xrot: {rotateX}°</label>
      <input
        type="range"
        min="0"
        max="360"
        class="slider"
        id="rotateX"
        bind:value={rotateX}
      />
    </div>
    <div>
      <label for="rotateY">Yrot: {rotateY}°</label>
      <input
        type="range"
        min="0"
        max="360"
        class="slider"
        id="rotateY"
        bind:value={rotateY}
      />
    </div>
    <div>
      <label for="rotateZ">Zrot: {rotateZ}°</label>
      <input
        type="range"
        min="0"
        max="360"
        class="slider"
        id="rotateZ"
        bind:value={rotateZ}
      />
    </div>
    {/if}
  </div>

  <hr />

  <div id="sphere-container">
    <Sphere
      {diameter}
      numLongLines={longitudeLines}
      numLatLines={latitudeLines}
      animationSpeed={animationSpeedSteps / animationSpeed}
      animate={animate}
      color={colors[color].variable}
      {rotateX}
      {rotateY}
      {rotateZ}
    />
  </div>

  <hr />

  <div class="text">
    <h3>About</h3>
    <p>This sphere uses 3D CSS rendering.  Each latitude and longitude line is actually
      a transparent div with a solid border, manually oriented and scaled in 3D space.  Javascript is used
      to do all the math (mostly a bunch of trigonometry) for placing the latitude and longitude lines, and with a bit of 
      Svelte's built in reactive updates, you can customize the number of lines
      in the sphere's frame by simply manipulating a handful of variables using the sliders.
    </p>

    <p>Using the browser developer tools to inspect the sphere while changing the sliders can give you a pretty good idea
      of how it works.  <strong>Try it out!</strong>
    </p>

    <p>See how the individual div elements are positioned to create the latitude and longitude
      lines?
    </p>

    <p>Thanks for checking out the sphere!  Feel free to take a look at the 
      <a href="https://github.com/Centerville1/matt-jones-website/tree/main/src/routes/home/sphere">source code</a>
      on Github if you're curious.  I can't promise it's the cleanest code, 
      but it works, and that's what matters :D
    </p>

    <h2>Thanks,</h2>
    <img src="/MJ_Signature-nobg.png" width=250 alt="Matt Jones' signature" />

  </div>
</div>

<style>
  #page {
    height: 100%;
    min-height: 80vh;
    width: 100%;
    overflow: hidden;
  }

  .text {
    margin: 30px;
  }

  .slider-container {
    margin: 20px;
    margin-left: 50px;
    width: 60%;
    height: fit-content;
    display: flex;
    justify-content: space-between;
    align-items: start;
    flex-wrap: wrap;
    color: var(--contrast-text-light);
  }

  .slider-container div {
    width: 140px;
    height: fit-content;
  }

  #sphere-container {
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    margin-bottom: 50px;
  }
</style>
