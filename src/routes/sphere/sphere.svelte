<!-- Based on this codepen by Chris Smith 
                                  https://codepen.io/chris22smith/pen/LGeVzz -->
<script>
	import './sphere.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Display setting props
	export let diameter = 200;
	export let numLongLines = 9;
	export let numLatLines = 5;
	export let color = '--logo-blue';

	// Animation controls
	export let animate = false;
	export let animationSpeed = 30;
	export let animationTimingFunction = 'linear';

	// Rotational translation props
	export let rotateX = 0;
	export let rotateY = 0;
	export let rotateZ = 0;
	// logo: X15, Y30, Z50;

	$: buildSphere(diameter, numLongLines, numLatLines);
	$: updateColor(color);
	$: updateAnimation(animate, animationSpeed, animationTimingFunction);
	$: updateRotation(rotateX, rotateY, rotateZ);

	/**
	 * @param {string} colorVarName
	 */
	function updateColor(colorVarName) {
		if (!browser) return;
		let latLines = document.getElementsByClassName('lat-line');
		let longLines = document.getElementsByClassName('long-line');
		if (latLines !== null && longLines !== null) {
			for (let i = 0; i < latLines.length; i++) {
				let latLine = latLines[i];
				latLine.style.borderColor = 'var(' + colorVarName + ')';
			}
			for (let i = 0; i < longLines.length; i++) {
				let longLine = longLines[i];
				longLine.style.borderColor = 'var(' + colorVarName + ')';
			}
		}
	}

	/**
	 * @param {number | null} animationDuration
	 * @param {boolean} [isSpinning]
	 * @param {string | null} animTiming
	 */
	function updateAnimation(
		isSpinning,
		animationDuration = null,
		animTiming = null
	) {
		if (!browser) return;
		let sphere = document.getElementById('sphere');
		if (sphere !== null) {
			if (animationDuration !== null)
				sphere.style.animationDuration = animationDuration + 's';
			if (animTiming !== null)
				sphere.style.animationTimingFunction = animTiming;
			if (isSpinning) {
				sphere.style.animationName = 'spin';
			} else {
				sphere.style.animationName = 'none';
			}
			sphere.style.animationIterationCount = 'infinite';
		}
	}

	/**
	 * @param {number} Xdegrees
	 * @param {number} Ydegrees
	 * @param {number} Zdegrees
	 */
	function updateRotation(Xdegrees, Ydegrees, Zdegrees) {
		if (!browser) return;
		let sphere = document.getElementById('sphere');
		if (sphere !== null) {
			sphere.style.transform =
				'rotateX(' +
				Xdegrees +
				'deg) rotateY(' +
				Ydegrees +
				'deg) rotateZ(' +
				Zdegrees +
				'deg)';
		}
	}

	/** Clear and create a wireframe sphere using HTML and CSS
	 *
	 * @param {number} diameter the diameter of the sphere to build in pixels
	 * @param {number} numLongLines the number of longitude lines to draw
	 * @param {number} numLatLines the number of latitude lines to draw
	 */
	function buildSphere(diameter, numLongLines, numLatLines) {
		if (!browser) return;
		let sphere = document.getElementById('sphere');
		let container = document.getElementById('container');
		if (sphere !== null && container !== null) {
			sphere.innerHTML = '';
			sphere.style.width = diameter + 'px';
			updateAnimation(animate, animationSpeed, animationTimingFunction);
			updateRotation(rotateX, rotateY, rotateZ);
			container.style.width = diameter + 'px';
			container.style.height = diameter + 'px';
			let longAngleDiff = 360 / numLongLines;
			// Add the latitude lines
			for (let i = 0; i < numLongLines; i++) {
				let longLine = document.createElement('div');
				longLine.classList.add('long-line');
				longLine.style.cssText =
					'transform: rotateY(' + longAngleDiff * i + 'deg); ';
				sphere?.appendChild(longLine);
			}

			// Calculate positioning for latitude lines
			let pi = 3.14159,
				radius = diameter / 2,
				angularSpacing = pi / (numLatLines + 1);

			let offsets = [];
			for (let i = 1; i <= numLatLines; i++) {
				// Calculate the inner angle for this slice of the sphere
				let currAngle = angularSpacing * i;
				if (angularSpacing * i > pi / 2) {
					currAngle = pi - currAngle;
				}
				// Using trig, calculate radius of current latitude line
				let currRadius = radius * Math.sin(currAngle);
				// Using trig, calculate offset (in px) of current latitude line along
				// the vertical axis of the sphere
				let currYOffset = radius * Math.cos(currAngle);
				offsets.push({ offset: currYOffset, radius: currRadius });
			}

			if (numLatLines % 2 !== 0) {
				let latLine = document.createElement('div');
				latLine.classList.add('lat-line');
				latLine.style.cssText = 'width: 100%;';
				sphere?.appendChild(latLine);
				// Add numLatLines number of latitude lines
			}
			for (let i = 0; i < numLatLines; i++) {
				let latLine = document.createElement('div');
				latLine.classList.add('lat-line');
				latLine.style.cssText =
					'width: ' +
					offsets[i].radius * 2 +
					'px; transform: rotateX(90deg) translateZ(' +
					(i < numLatLines / 2 ? -1 : 1) * offsets[i].offset +
					'px); ';
				sphere?.appendChild(latLine);
			}

			// Set lines height to the same as their width
			let latLines = document.getElementsByClassName('lat-line');
			let longLines = document.getElementsByClassName('long-line');
			if (latLines !== null && longLines !== null) {
				for (let i = 0; i < latLines.length; i++) {
					let latLine = latLines[i];
					latLine.style.height = latLine.clientWidth + 'px';
					latLine.style.borderColor = 'var(' + color + ')';
				}
				for (let i = 0; i < longLines.length; i++) {
					let longLine = longLines[i];
					longLine.style.height = longLine.clientWidth + 'px';
					longLine.style.borderColor = 'var(' + color + ')';
				}
			}
		}
	}

	onMount(() => {
		buildSphere(diameter, numLongLines, numLatLines, animationSpeed, color);
	});
</script>

<div id="container">
	<div id="scene">
		<div id="sphere"></div>
	</div>
</div>
