<!-- Based on this codepen by Chris Smith 
                                  https://codepen.io/chris22smith/pen/LGeVzz -->
<script>
  import './sphereLoader.css';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Display setting props
  // const diameter = 500;
  const numLongLines = 9;
  const numLatLines = 5;
  const color = '--logo-blue';

  /** Clear and create a wireframe sphere using HTML and CSS
   *
   * @param {number} numLongLines the number of longitude lines to draw
   * @param {number} numLatLines the number of latitude lines to draw
   */
  function buildSphere(numLongLines, numLatLines) {
    if (!browser) return;
    const sphere = document.getElementById('sphere');
    const container = document.getElementById('container');
    if (sphere !== null && container !== null) {
      sphere.innerHTML = '';
      let diameter = sphere.clientWidth;
      sphere.style.width = diameter + 'px';
      const longAngleDiff = 360 / numLongLines;
      // Add the longitude lines
      for (let i = 0; i < numLongLines; i++) {
        let longLine = document.createElement('div');
        longLine.classList.add('long-line');
        longLine.style.cssText =
          'transform: rotateY(' + longAngleDiff * i + 'deg); ';
        sphere?.appendChild(longLine);
      }

      const pi = 3.14159,
        equatorRadius = diameter / 2,
        angularSpacing = pi / (numLatLines + 1);
      let yOffsets = [];

      // Calculate position and size of each latitude line
      for (let i = 1; i <= numLatLines; i++) {
        // Calculate angle between the equator and this latitude line
        let angleToEquator = angularSpacing * i;
        if (angularSpacing * i > pi / 2) {
          angleToEquator = pi - angleToEquator;
        }
        // Calculate radius of this latitude line
        let latitudeRadius = equatorRadius * Math.sin(angleToEquator);
        // Calculate the vertical distance in pixels between this
        // latitude line and the equator
        let currYOffset = equatorRadius * Math.cos(angleToEquator);
        yOffsets.push({ offset: currYOffset, radius: latitudeRadius });
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
          yOffsets[i].radius * 2 +
          'px; transform: rotateX(90deg) translateZ(' +
          (i < numLatLines / 2 ? -1 : 1) * yOffsets[i].offset +
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
    buildSphere(numLongLines, numLatLines);
  });
</script>

<div id="outer-container">
  <div id="logo">
    <div id="signature">
      <svg
        height="80vw"
        width="80vw"
        fill="var(--main-blue)"
        viewBox="101.4248 163.0935 298.7651 146.9131"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 329 1450 C 257 1412 144 1254 86 1111 C 56 1037 10 923 10 916 C 10 903 38 885 46 893 C 48 894 63 936 81 985 C 139 1149 209 1269 298 1357 C 347 1404 385 1428 395 1418 C 399 1414 381 1361 311 1172 C 270 1062 258 987 277 960 C 297 931 311 935 345 980 C 361 1002 384 1027 397 1035 C 419 1050 420 1049 420 1027 C 420 987 447 960 488 960 C 532 960 595 1000 683 1082 C 714 1111 740 1135 740 1134 C 740 1134 731 1108 720 1076 C 710 1045 693 982 684 936 L 668 852 L 617 835 C 512 801 410 734 288 622 C 219 558 140 443 110 363 C 81 286 80 178 108 123 C 163 17 275 -27 375 19 C 428 43 508 131 552 216 C 597 302 619 374 674 620 C 726 855 713 842 902 848 C 1090 854 1166 844 1740 740 C 2029 687 2105 678 2275 677 C 2406 676 2461 680 2514 693 C 2770 757 2967 919 2995 1088 C 3005 1150 2986 1141 2950 1068 C 2903 973 2856 915 2782 860 C 2648 761 2498 718 2285 719 C 2175 719 2006 735 1897 755 C 1856 763 1283 857 1225 865 C 1198 869 1164 874 1150 876 C 1075 887 893 890 820 881 C 774 875 735 872 733 874 C 726 881 772 1067 801 1150 C 845 1276 846 1280 822 1280 C 807 1280 794 1265 775 1225 C 732 1138 585 1016 498 994 C 471 988 470 989 470 1026 C 469 1071 451 1100 424 1100 C 414 1100 388 1083 366 1063 C 339 1036 329 1031 334 1045 C 338 1056 344 1078 347 1095 C 351 1111 362 1147 373 1175 C 418 1292 450 1386 450 1403 C 450 1426 406 1470 383 1470 C 373 1469 349 1460 329 1450 Z M 620 622 C 582 437 545 301 517 245 C 439 88 330 2 246 30 C 196 46 145 107 130 169 C 93 324 221 543 435 690 C 500 735 644 802 648 790 C 650 784 638 708 620 622 Z"
          transform="matrix(0.10000000149011612, 0, 0, -0.10000000149011612, 100.424789428711, 310.0935363769531)"
        />
      </svg>
    </div>
    <div id="container">
      <div id="scene">
        <div id="sphere"></div>
      </div>
    </div>
  </div>
</div>
