<script>
  import { onMount } from 'svelte';
  import { bios, stringTransformSteps } from './bio';
  import { browser } from '$app/environment';

  /**
   * @type {string[]}
   */
  let currentBios = [];

  /**
   * @param {string[]} bioArray
   */
  function generateBio(bioArray) {
    console.log(bioArray);
    if (!browser) return;
    currentBios = bioArray;
    const bio = document.getElementById('bio');
    if (bio !== null) {
      bio.innerHTML = '';
      for (let i = 0; i < bioArray.length; i++) {
        if (bioArray[i].trim() !== '') {
          let paragraph = document.createElement('p');
          console.log(bioArray[i], typeof bioArray[i], bioArray[i] === '');
          paragraph.innerText = bioArray[i];
          bio.appendChild(paragraph);
        }
      }
    }
  }

  onMount(() => {
    generateBio(bios.mid.default);
  });

  /**
   * @param {string[]} startBioArray
   * @param {string[]} endBioArray
   */
  function transformBio(startBioArray, endBioArray) {
    // console.log(startBioArray, typeof startBioArray[1], endBioArray);
    let startLength = startBioArray.length,
      endLength = endBioArray.length;
    if (startLength > endLength) {
      for (let i = 0; i < startLength - endLength; i++) endBioArray.push('');
    } else if (endLength > startLength) {
      for (let i = 0; i < endLength - startLength; i++) startBioArray.push('');
    }
    let eachSteps = [];
    for (let i = 0; i < startBioArray.length; i++) {
      eachSteps.push(
        stringTransformSteps(startBioArray[i], endBioArray[i], 70),
      );
    }
    let startLengthEnd = startBioArray.length,
      endLengthEnd = endBioArray.length;
    startBioArray.forEach((value, index, array) => {
      if (value.trim() === '') array.splice(index, 1);
    });
    endBioArray.forEach((value, index, array) => {
      if (value.trim() === '') array.splice(index, 1);
    });
    // for (let i = 0; i < startLengthEnd - startLength; i++) startBioArray.pop();
    // for (let i = 0; i < endLengthEnd - endLength; i++) endBioArray.pop();
    animateTransformation(eachSteps);
  }

  /**
   * @param {string[][]} eachSteps
   */
  function animateTransformation(eachSteps) {
    let currBioArray = [];
    for (let i = 0; i < eachSteps.length; i++) {
      let currSteps = eachSteps[i];
      currBioArray.push(currSteps[0]);
      if (currSteps.length !== 1) {
        eachSteps[i].splice(0, 1); // remove the first element from the array
      }
    }
    generateBio(currBioArray);
    if (eachSteps[0].length !== 1) {
      setTimeout(
        () => {
          animateTransformation(eachSteps);
        },
        Math.round(Math.random() * 50),
      );
    }
  }
</script>

<div id="page">
  <h1>About Me</h1>

  <div id="bio"></div>

  <button
    on:click={() => {
      transformBio(currentBios, bios.short.default);
    }}
  >
    Short
  </button>
  <button
    on:click={() => {
      transformBio(currentBios, bios.mid.default);
    }}
  >
    Medium
  </button>
  <button
    on:click={() => {
      transformBio(currentBios, bios.long.default);
    }}
  >
    Long
  </button>
</div>

<style>
  #page {
    width: 80vw;
    margin-left: auto;
    margin-right: auto;
  }

  #bio {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 1s;
  }

  #bio p {
  }
</style>
