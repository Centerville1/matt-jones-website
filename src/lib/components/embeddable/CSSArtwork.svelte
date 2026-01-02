<script>
  // Component props (configurable from blog editor)
  export let piece = 'all';
  export let animationSpeed = 1;
  export let showTitle = false;

  // Animation duration based on speed
  $: animationDuration = animationSpeed > 0 ? 0.5 / animationSpeed : 0.5;
</script>

<div class="css-artwork-container">
  {#if piece === 'all' || piece === 'geometric'}
    <div class="artwork-section">
      {#if showTitle}
        <h3>Geometric Grid</h3>
      {/if}
      <div id="art" style="animation-duration: {animationDuration}s;">
        <div></div>
        <div>
          <div></div>
        </div>
        <div></div>
        <div>
          <div></div>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  {/if}

  {#if piece === 'all' || piece === 'organic'}
    <div class="artwork-section">
      {#if showTitle}
        <h3>Organic Pattern</h3>
      {/if}
      <div id="pattern" style="animation-duration: {animationDuration}s;">
        <div><i></i></div>
        <div><i></i></div>
        <div><i></i></div>
        <div><i><span></span></i></div>
        <div><i><span></span></i></div>
        <div><i></i><i></i><i></i><i></i></div>
        <div><i></i><i></i><i></i><i></i></div>
        <div><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div></div>
        <div><i></i></div>
        <div><i></i></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div><i></i><i></i></div>
        <div><i><span></span></i></div>
        <div><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div><i><span></span></i></div>
        <div><i></i></div>
        <div><i></i></div>
        <div></div>
        <div><i></i></div>
        <div></div>
        <div><i></i></div>
      </div>
    </div>
  {/if}

  {#if piece === 'all' || piece === 'octagon'}
    <div class="artwork-section">
      {#if showTitle}
        <h3>Octagon Animation</h3>
      {/if}
      <div class="scroll-animation octagon">
        <div>
          <div style="animation-duration: {5 / animationSpeed}s;"></div>
        </div>
      </div>
    </div>
  {/if}

  {#if piece === 'all' || piece === 'polygon'}
    <div class="artwork-section">
      {#if showTitle}
        <h3>Polygon Animation</h3>
      {/if}
      <div class="scroll-animation polygon">
        <div>
          <div style="animation-duration: {1.5 / animationSpeed}s;"></div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .css-artwork-container {
    width: 100%;
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .artwork-section {
    width: 100%;
  }

  .artwork-section h3 {
    text-align: center;
    margin-bottom: 1rem;
    color: var(--contrast-text-light);
  }

  #art {
    margin-left: auto;
    margin-right: auto;
    background-color: var(--neutral-white);
    width: 90%;
    max-width: 600px;
    aspect-ratio: 1 / 1;
    font-size: 0;
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
    grid-template-rows: 33.33% 33.33% 33.33%;
    animation: scale 0.5s ease-in-out both;
    animation-timeline: view();
    animation-range-start: 30vh;
    animation-range-end: 80vh;
  }

  #art div:nth-child(1) {
    background-color: var(--main-blue);
    aspect-ratio: 1 / 1;
    border-radius: 40% 0% 0% 40%;
  }

  #art div:nth-child(2) {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    rotate: 45deg;
  }

  #art div:nth-child(2) div {
    width: 70.7%;
    background-color: var(--main-blue-light);
    border-radius: 0;
  }

  #art div:nth-child(3) {
    background-color: var(--neutral-brown);
    border-top-right-radius: 80%;
  }

  #art div:nth-child(4) {
    background-color: var(--red);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #art div:nth-child(4) div {
    width: 80%;
    aspect-ratio: 1 / 1;
    background-color: var(--neutral-white);
    border-radius: 0;
  }

  #art div:nth-child(5) {
    border-radius: 50%;
    background-color: var(--green);
  }

  #art div:nth-child(6) {
    background-color: var(--neutral-brown);
    border-bottom-right-radius: 80%;
  }

  #art div:nth-child(7) {
    background-color: var(--red);
    border-radius: 40% 40% 0 40%;
  }

  #art div:nth-child(8) {
    background-color: var(--green);
    clip-path: polygon(
      50% 0,
      0 100%,
      20% 100%,
      50% 30%,
      75% 85%,
      10% 85%,
      10% 100%,
      100% 100%
    );
  }

  #art div:nth-child(9) {
    background-color: var(--red);
    border-radius: 0 80% 0 0;
  }

  #pattern {
    width: 90%;
    max-width: 600px;
    background-color: var(--neutral-white);
    border: 10px solid var(--neutral-white);
    aspect-ratio: 7/6;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-template-columns: 14.28% 14.28% 14.28% 14.28% 14.28% 14.28% 14.28%;
    grid-template-rows: 16.66% 16.66% 16.66% 16.66% 16.66% 16.66%;
    animation: scale 0.5s ease-in-out both;
    animation-timeline: view();
    animation-range-start: 30vh;
    animation-range-end: 80vh;
  }

  #pattern div:nth-child(1) {
    background-color: var(--main-blue);
  }
  #pattern div:nth-child(1) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--main-blue-light);
    clip-path: polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%);
  }
  #pattern div:nth-child(2) {
    background-color: var(--main-blue);
  }
  #pattern div:nth-child(2) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--neutral-brown);
    clip-path: polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%);
  }
  #pattern div:nth-child(3) {
    background-color: var(--main-blue);
  }

  #pattern div:nth-child(3) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--red);
    clip-path: polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%);
  }

  #pattern div:nth-child(4) {
    background-color: var(--main-blue);
  }

  #pattern div:nth-child(4) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--green);
    clip-path: circle(50%);
    z-index: 5;
  }

  #pattern div:nth-child(4) i span {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--neutral-white);
    clip-path: circle(20%);
    z-index: 10;
  }

  #pattern div:nth-child(5) {
    background-color: var(--main-blue);
  }

  #pattern div:nth-child(5) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--green);
    clip-path: circle(50%);
    z-index: 5;
  }

  #pattern div:nth-child(5) i span {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--neutral-white);
    clip-path: circle(20%);
    z-index: 10;
  }

  #pattern div:nth-child(6) {
    background-color: var(--green);
  }

  #pattern div:nth-child(6) i:nth-child(even) {
    display: inline-block;
    width: 25%;
    height: 100%;
    background-color: var(--red);
  }

  #pattern div:nth-child(6) i:nth-child(odd) {
    display: inline-block;
    width: 25%;
    height: 100%;
  }

  #pattern div:nth-child(7) {
    background-color: var(--green);
  }

  #pattern div:nth-child(7) i:nth-child(even) {
    display: inline-block;
    width: 25%;
    height: 100%;
    background-color: var(--red);
  }

  #pattern div:nth-child(7) i:nth-child(odd) {
    display: inline-block;
    width: 25%;
    height: 100%;
  }

  #pattern div:nth-child(8) {
    height: 200%;
    width: 200%;
  }

  #pattern div:nth-child(8) i:nth-child(even) {
    display: block;
    width: 100%;
    height: 14.285%;
    background-color: var(--main-blue-light);
  }

  #pattern div:nth-child(8) i:nth-child(odd) {
    display: block;
    width: 100%;
    height: 14.285%;
    background-color: var(--green);
  }

  #pattern div:nth-child(9) {
    grid-column: 3;
    height: 200%;
    width: 200%;
    background-color: var(--neutral-brown);
    clip-path: polygon(0% 0%, 100% 100%, 100% 0%);
  }

  #pattern div:nth-child(10) {
    grid-column: 5;
    background-color: var(--green);
  }

  #pattern div:nth-child(10) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--main-blue);
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  }

  #pattern div:nth-child(11) {
    background-color: var(--green);
  }

  #pattern div:nth-child(11) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--red);
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  }

  #pattern div:nth-child(12) {
    background-color: var(--green);
  }

  #pattern div:nth-child(13) {
    grid-column: 5;
    background-color: var(--neutral-brown);
    clip-path: circle(50%);
  }

  #pattern div:nth-child(14) {
    background-color: var(--red);
    clip-path: circle(50%);
  }

  #pattern div:nth-child(15) {
    background-color: var(--green);
    clip-path: circle(50%);
  }

  #pattern div:nth-child(16) {
    height: 300%;
    background-color: var(--red);
  }

  #pattern div:nth-child(16) i:first-child {
    display: block;
    height: 50%;
    width: 100%;
    background-color: var(--green);
    clip-path: ellipse(100% 80% at 100% 0%);
  }

  #pattern div:nth-child(16) i:last-child {
    display: block;
    height: 50%;
    width: 100%;
    background-color: var(--main-blue);
    clip-path: ellipse(100% 80% at 0% 100%);
  }

  #pattern div:nth-child(17) {
    height: 200%;
    width: 200%;
    background-color: var(--main-blue-light);
  }

  #pattern div:nth-child(17) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--neutral-white);
    clip-path: circle(25%);
  }

  #pattern div:nth-child(17) span {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--red);
    clip-path: circle(11%);
  }

  #pattern div:nth-child(18) {
    grid-column: 4;
    height: 300%;
    width: 100%;
    background-color: var(--green);
  }

  #pattern div:nth-child(18) i {
    display: inline-block;
    width: 14.285%;
    height: 100%;
  }

  #pattern div:nth-child(18) i:nth-child(even) {
    background-color: var(--neutral-white);
  }

  #pattern div:nth-child(19) {
    width: 200%;
    height: 200%;
    background-color: var(--green);
  }

  #pattern div:nth-child(19) i {
    display: block;
    width: 100%;
    height: 100%;
    background-color: var(--red);
    clip-path: circle(100% at left bottom);
  }
  #pattern div:nth-child(19) span {
    display: block;
    width: 100%;
    height: 100%;
    background-color: var(--neutral-white);
    clip-path: circle(50% at left bottom);
  }

  #pattern div:nth-child(20) {
    grid-column: 7;
    background-color: var(--green);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #pattern div:nth-child(20) i {
    display: block;
    background-color: var(--neutral-white);
    height: 50%;
    width: 50%;
    rotate: 45deg;
  }

  #pattern div:nth-child(21) {
    grid-column: 7;
    background-color: var(--green);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #pattern div:nth-child(21) i {
    display: block;
    background-color: var(--neutral-white);
    height: 60%;
    width: 50%;
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  }

  #pattern div:nth-child(22) {
    grid-column: 2;
    width: 200%;
    background-color: var(--green);
  }

  #pattern div:nth-child(23) {
    grid-column: 5;
    background-color: var(--red);
  }

  #pattern div:nth-child(23) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--main-blue-light);
    clip-path: polygon(0% 100%, 100% 100%, 100% 0%);
  }

  #pattern div:nth-child(24) {
    background-color: var(--red);
  }

  #pattern div:nth-child(25) {
    background-color: var(--red);
  }

  #pattern div:nth-child(25) i {
    display: block;
    height: 100%;
    width: 100%;
    background-color: var(--green);
    clip-path: polygon(0% 100%, 100% 100%, 100% 0%);
  }

  .scroll-animation {
    margin-left: auto;
    margin-right: auto;
    background-color: var(--neutral-white);
    width: 90%;
    max-width: 600px;
    aspect-ratio: 1 / 1;
    font-size: 0;
  }

  .scroll-animation div {
    width: 100%;
    height: 100%;
  }

  .octagon div div {
    background-color: var(--main-blue);
    animation: octagon 5s linear both;
    animation-timeline: view();
    animation-range-start: 70vh;
    animation-range-end: 90vh;
  }

  .polygon div div {
    background-color: var(--main-blue);
    animation: polygon 1.5s ease-in-out infinite alternate;
  }

  @keyframes octagon {
    0% {
      clip-path: polygon(
        30% 0%,
        70% 0%,
        100% 30%,
        100% 70%,
        70% 100%,
        30% 100%,
        0% 70%,
        0% 30%
      );
    }
    100% {
      clip-path: polygon(
        50% 0%,
        50% 0%,
        100% 50%,
        100% 50%,
        50% 100%,
        50% 100%,
        0% 50%,
        0% 50%
      );
    }
  }

  @keyframes polygon {
    0% {
      clip-path: polygon(
        0% 37.5%,
        35% 37.5%,
        35% 0%,
        65% 0%,
        65% 37.5%,
        100% 37.5%,
        100% 62.5%,
        65% 62.5%,
        65% 100%,
        35% 100%,
        35% 62.5%,
        0% 62.5%
      );
    }
    100% {
      clip-path: polygon(
        100% 20%,
        70% 50%,
        100% 80%,
        80% 100%,
        50% 70%,
        20% 100%,
        0% 80%,
        30% 50%,
        0% 20%,
        20% 0%,
        50% 30%,
        80% 0%
      );
    }
  }

  @keyframes scale {
    0% {
      scale: 0.8;
    }
    100% {
      scale: 1;
    }
  }
</style>
