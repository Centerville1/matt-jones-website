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
    overflow: hidden;
    background-image:  linear-gradient(30deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(150deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(30deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(150deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(60deg, var(--neutral-dark-gray-op-10) 25%, transparent 25.5%, transparent 75%, var(--neutral-dark-gray-op-10) 75%, var(--neutral-dark-gray-op-10)), 
    linear-gradient(60deg, var(--neutral-dark-gray-op-10) 25%, transparent 25.5%, transparent 75%, var(--neutral-dark-gray-op-10) 75%, var(--neutral-dark-gray-op-10));
    background-size: 80px 140px;
    background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  }

  #sphere-container {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    margin-bottom: 50px;
  }
</style>
