# 3D CSS Sphere

## Overview

This sphere uses 3D CSS rendering.  Each latitude and longitude line is actually
a transparent div with a solid border, manually oriented in 3D space.  Javascript is used
to do all the math for placing the latitude and longitude lines, and with a bit of 
Svelte's built in reactive updates, you can customize the number of lines
in the sphere's frame by simply manipulating a handful of variables using the on screen sliders.

## Files

- customSphere.svelte - Page with sliders and variables for manipulating sphere.
  
- sphere.svelte - The independent sphere component, with modifiable attributes to customize sphere appearance.
  
- sphere.css - style for the sphere component (styling must be in separate file, since most of the sphere is added in Javascript, the style section in svelte files by default doesn't apply to elements added by Javascript (I believe this is due to Svelte's SSR implementation).

- sphereLoader.svelte - The version of the sphere used in the site intro animation, hard coded with all the animations.

- sphereLoader.css - styles for the sphereLoader component (seperate file for same reason as above).

- SphereSpinning - Earlier version of the sphere component with fewer externally available attributes compared with the newer sphere.svelte component.
