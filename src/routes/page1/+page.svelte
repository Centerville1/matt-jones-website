<script>
</script>

<div id="container">
	<div id="text">
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
			Clip path animations from <a
				href="https://css-tricks.com/animating-with-clip-path/">this website.</a
			>
		</p>
		<p>
			Clip path <a href="https://bennettfeely.com/clippy/">editor and creator</a
			> by Bennett Feely
		</p>
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
	<div class="scroll-animation octagon">
		<div><div></div></div>
	</div>
	<hr />
	<div class="scroll-animation polygon">
		<div><div></div></div>
	</div>
</div>

<style>
	#container {
		width: 100vw;
		height: 500vh;
		background-color: var(--main-blue-light);
	}

	#text {
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
		height: 80vh;
		aspect-ratio: 1 / 1;
		font-size: 0;
		display: grid;
		grid-template-columns: 33.33% 33.33% 33.33%;
		grid-template-rows: 33.33% 33.33% 33.33%;
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
		height: 80vh;
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
		animation-range: entry 300px;
	}

	.polygon div div {
		background-color: var(--main-blue);
		animation: polygon 3s ease-in-out infinite;
	}

	@keyframes polygon {
		0% {
			clip-path: polygon(
				10% 25%,
				35% 25%,
				35% 0%,
				65% 0%,
				65% 25%,
				90% 25%,
				90% 50%,
				65% 50%,
				65% 100%,
				35% 100%,
				35% 50%,
				10% 50%
			);
		}
		50% {
			clip-path: polygon(
				20% 0%,
				0% 20%,
				30% 50%,
				0% 80%,
				20% 100%,
				50% 70%,
				80% 100%,
				100% 80%,
				70% 50%,
				100% 20%,
				80% 0%,
				50% 30%
			);
		}
		100% {
			clip-path: polygon(
				10% 25%,
				35% 25%,
				35% 0%,
				65% 0%,
				65% 25%,
				90% 25%,
				90% 50%,
				65% 50%,
				65% 100%,
				35% 100%,
				35% 50%,
				10% 50%
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
</style>
