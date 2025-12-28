<script>
</script>

<div id="container">
  <div class="text">
    <h1>CSS Experiments</h1>
    <p>
      Experiments using CSS to draw shapes and create artwork. Plus some tests
      with animations using clip paths, and mapping animations to the scroll
      position using pure CSS as found in <a
        href="https://www.youtube.com/watch?v=UmzFk68Bwdk&ab_channel=KevinPowell"
      >
        this video
      </a> by Kevin Powell.
    </p>
    <h3>Resources</h3>
    <p>
      Design ideas from this <a
        href="https://coolors.co/visualizer/4859a8-8bbcda-3f3631-c41717-227c40"
        >visualizer</a
      > by Coolors.com.
    </p>
    <p>
      Clip path animations how-to from <a
        href="https://css-tricks.com/animating-with-clip-path/">this website.</a
      >
    </p>
    <p>
      Clip path <a href="https://bennettfeely.com/clippy/">editor and creator</a
      > by Bennett Feely
    </p>
    <h3>CSS Artwork</h3>
    <p>
      All of these art pieces are pure HTML and CSS. Feel free to inspect it to
      see how they work.
    </p>
    <h5>(Artwork based directly on Coolors.com design samples)</h5>
  </div>
  <div id="art">
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
  <hr />
  <div id="pattern">
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
  <hr />
  <div class="spacing"></div>
  <hr />
  <div class="text">
    <h3>Clip-path based animations</h3>
    <p>
      Animations using CSS clip paths (creating polygons by defining a series of
      points). CSS can automatically interpolate between two clip paths using
      transitions, allowing you to create all sorts of very interesting
      animations (a small sample of my initial experiments are here.)
    </p>
  </div>
  <div class="scroll-animation octagon">
    <div><div></div></div>
  </div>
  <hr />
  <div class="scroll-animation polygon">
    <div><div></div></div>
  </div>
  <hr />
  <div class="spacing"></div>
  <hr />
  <div class="text">
    <h3>Artwork</h3>
    <p>
      Now, <strong>try creating you own artwork</strong> using CSS and HTML. Check
      out the resources up above for the tips and tricks I used to create this sampling
      here!
    </p>
  </div>
  <div class="spacing"></div>
</div>

<style>
  #container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    height: fit-content;
  }

  hr {
    width: 100%;
  }

  .spacing {
    margin-top: 100px;
  }

  .text {
    width: 70vw;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
  }

  #container a {
    transition: color 0.5s;
    color: var(--contrast-purple);
  }

  #container a:hover {
    color: var(--main-blue);
  }

  #art {
    margin-left: auto;
    margin-right: auto;
    background-color: var(--neutral-white);
    width: 90vw;
    max-width: 600px;
    aspect-ratio: 1 / 1;
    font-size: 0;
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
    grid-template-rows: 33.33% 33.33% 33.33%;
    animation: scale 0.5s ease-in-out both;
    animation-timeline: view();
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

  /* CSS Triangles */
  /* https://alvaromontoro.com/blog/67970/drawing-a-triangle-with-css */
  /* 
	#art div:nth-child(8) {
		background-image: linear-gradient(to bottom right, transparent 50%, red 0),
			linear-gradient(to top right, red 50%, transparent 0);
		background-size: 50% 100%;
		background-repeat: no-repeat;
		background-position: left, right;
	} */

  /* https://bennettfeely.com/clippy/ */
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

  .scroll-animation {
    margin-left: auto;
    margin-right: auto;
    background-color: var(--neutral-white);
    width: 90vw;
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
    animation-range: entry 30vh;
  }

  .polygon div div {
    background-color: var(--main-blue);
    animation: polygon 1.5s ease-in-out infinite alternate;
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

  @keyframes arrows {
    0% {
      clip-path: polygon(
        40% 0%,
        40% 20%,
        100% 20%,
        100% 80%,
        40% 80%,
        40% 100%,
        0% 50%
      );
    }
    50% {
      clip-path: polygon(
        0% 20%,
        60% 20%,
        60% 0%,
        100% 50%,
        60% 100%,
        60% 80%,
        0% 80%
      );
    }
    100% {
      clip-path: polygon(
        40% 0%,
        40% 20%,
        100% 20%,
        100% 80%,
        40% 80%,
        40% 100%,
        0% 50%
      );
    }
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

  @keyframes scale {
    0% {
      scale: 0.8;
    }
    100% {
      scale: 1;
    }
  }

  #pattern {
    width: 90vw;
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
</style>
