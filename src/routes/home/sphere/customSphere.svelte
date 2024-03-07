<script>
  import Sphere from './sphere.svelte';

  let longitudeLines = 9,
    latitudeLines = 5,
    diameter = 400,
    animationSpeed = 30,
    animationSpeedSteps = 300,
    color = 0,
    animate = false,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0;

  let colors = [
    { title: 'Dark Blue', variable: '--logo-blue' },
    { title: 'Light Blue', variable: '--main-blue-light' },
    { title: 'Red', variable: '--red' },
    { title: 'Green', variable: '--green' },
    { title: 'Purple', variable: '--contrast-purple' },
    { title: 'White', variable: '--neutral-white' },
    { title: 'Gray', variable: '--neutral-gray-op-50' },
  ];
</script>

<div id="page">
  <div class="slider-container">
    <div>
      <label for="diam">Diameter: {diameter}px</label>
      <input
        type="range"
        min="0"
        max="700"
        step="10"
        class="slider"
        id="diam"
        bind:value={diameter}
      />
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
      <label for="long">Longitude Lines: {longitudeLines}</label>
      <input
        type="range"
        min="1"
        max="50"
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
  </div>

  <div id="sphere-container">
    <Sphere
      {diameter}
      numLongLines={longitudeLines}
      numLatLines={latitudeLines}
      animationSpeed={animationSpeedSteps / animationSpeed}
      color={colors[color].variable}
      {rotateX}
      {rotateY}
      {rotateZ}
    />
  </div>
</div>

<style>
  #page {
    height: 100%;
    min-height: 80vh;
    width: 100%;
    background-color: var(--neutral-gray);
    overflow: hidden;
  }
  .slider-container {
    margin-top: 10px;
    margin-left: 50px;
    width: 300px;
    height: 200px;
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
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    margin-bottom: 50px;
  }
</style>
