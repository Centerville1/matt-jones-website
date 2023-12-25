<script>
	import Sphere from './sphere.svelte';
	import CustomSphere from './customSphere.svelte';
</script>

<div id="page">
	<div id="sphere-container">
		<CustomSphere />
	</div>
</div>

<style>
	#page {
		height: 100%;
		min-height: 80vh;
		width: 100%;
		background-color: var(--contrast-text-light);
		overflow: hidden;
	}

	#sphere-container {
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		margin-top: 50px;
		margin-bottom: 50px;
	}
</style>
