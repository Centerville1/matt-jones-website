<!-- Based on this codepen by Chris Smith 
                                  https://codepen.io/chris22smith/pen/LGeVzz -->
<script>
	import './sphere.css';
	import { onMount } from 'svelte';

	export let diameter = 400;
	export let numLongitudeLines = 9;
	export let numLatitudeLines = 5;

	onMount(() => {
		let sphere = document.getElementById('sphere');
		if (sphere !== null) {
			sphere.style.width = diameter + 'px';
			let longAngleDiff = 360 / numLongitudeLines;
			// Add the latitude lines
			for (let i = 0; i < numLongitudeLines; i++) {
				let longLine = document.createElement('div');
				longLine.classList.add('long-line');
				longLine.style.cssText =
					'transform: rotateY(' + longAngleDiff * i + 'deg); ';
				sphere?.appendChild(longLine);
			}

			// Calculate positioning for latitude lines
			let pi = 3.14159,
				radius = diameter / 2,
				angularSpacing = pi / (numLatitudeLines + 1);

			let offsets = [];
			for (let i = 1; i <= numLatitudeLines; i++) {
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

			console.log(offsets);

			if (numLatitudeLines % 2 !== 0) {
				let latLine = document.createElement('div');
				latLine.classList.add('lat-line');
				latLine.style.cssText = 'width: 100%;';
				sphere?.appendChild(latLine);
				// Add numLatitudeLines number of latitude lines
			}
			for (let i = 0; i < numLatitudeLines; i++) {
				let latLine = document.createElement('div');
				latLine.classList.add('lat-line');
				latLine.style.cssText =
					'width: ' +
					offsets[i].radius * 2 +
					'px; transform: rotateX(90deg) translateZ(' +
					(i < numLatitudeLines / 2 ? -1 : 1) * offsets[i].offset +
					'px); ';
				sphere?.appendChild(latLine);
			}
		}
	});
</script>

<div id="scene">
	<div id="sphere"></div>
</div>
