<script>
  import { onMount } from 'svelte';
  import { bios, stringTransformSteps } from './bio';
  import { browser } from '$app/environment';
  import MediaQuery from 'svelte-media-query';

  export let height = 0;

  // Keep track of screen width (using react:window below)
  let prevWidth = 0
  $: innerWidth = 0;

  /**
   * @type {string[]}
   */
  let currentBios = [];

  let selectedLength = 'mid';

  /**
   * @type {any}
   */
  export let onButtonClick;

  onMount(() => {
    setup();
  });

  // Update height of bio container box whenever screen width changes
  $: (() => {
    (innerWidth); // Listen to changes in the inner width variable
    if (Math.abs(innerWidth - prevWidth) > 20) {
      prevWidth = innerWidth;
      height = calcHeight(currentBios);
    }
  }) ()

  function setup() {
    const bio = document.getElementById('bio');
    if (bio !== null) {
      generateBio(bios.mid.default);
      height = calcHeight(currentBios);
    }
    else {
      setTimeout(setup, 50);
    }
  }

  /**
   * @param {string[]} bioArray
   */
  function generateBio(bioArray) {
    if (!browser) return;
    currentBios = bioArray;
    const bio = document.getElementById('bio');
    if (bio !== null) {
      bio.innerHTML = '';
      for (let i = 0; i < bioArray.length; i++) {
        if (bioArray[i].trim() !== '') {
          let paragraph = document.createElement('p');
          paragraph.innerText = bioArray[i];
          bio.appendChild(paragraph);
        }
      }
      return true;
    }
  }

  /**
   * @param {string[]} bioArray
   * @returns {number}
   */
  function calcHeight(bioArray) {
    if (!browser) return height;
    currentBios = bioArray;
    const bio = document.getElementById('bio');
    if (bio !== null) {
      bio.innerHTML = '';
      for (let i = 0; i < bioArray.length; i++) {
        if (bioArray[i].trim() !== '') {
          let paragraph = document.createElement('p');
          paragraph.innerText = bioArray[i];
          bio.appendChild(paragraph);
        }
      }
      // Set the height of the bio box to the calculated height
      let height = bio.clientHeight + 20;
      return height;
    }
    return height;
  }

  /**
   * @param {string[]} startBioArray
   * @param {string[]} endBioArray
   */
  function transformBio(startBioArray, endBioArray) {
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
    startBioArray.forEach((value, index, array) => {
      if (value.trim() === '') array.splice(index, 1);
    });
    endBioArray.forEach((value, index, array) => {
      if (value.trim() === '') array.splice(index, 1);
    });
    height = calcHeight(endBioArray);
    animateTransformation(eachSteps, selectedLength);
  }

  /**
   * @param {string[][]} eachSteps
   * @param {string} [currLength]
   */
  function animateTransformation(eachSteps, currLength) {
    let currBioArray = [];
    for (let i = 0; i < eachSteps.length; i++) {
      let currSteps = eachSteps[i];
      currBioArray.push(currSteps[0]);
      if (currSteps.length !== 1) {
        eachSteps[i].splice(0, 1); // remove the first element from the array
      }
    }
    generateBio(currBioArray);
    if (eachSteps[0].length !== 1 && currLength === selectedLength) {
      let multiplier = (1 / eachSteps[0].length) * 10;
      setTimeout(
        () => {
          animateTransformation(eachSteps, currLength);
        },
        Math.round(multiplier * 50),
      );
    }
  }

  /**
   * @param {{ currentTarget: { value: string; }; }} event
   */
  function onChange(event) {
    selectedLength = event.currentTarget.value;
    // @ts-ignore
    transformBio(currentBios, bios[event.currentTarget.value].default);
    onButtonClick();
  }
</script>

<svelte:window bind:innerWidth />

<div id="bio-container">
  <MediaQuery query="(min-width: 440px)" let:matches>
    {#if matches}
      <div id="bio"></div>
    {/if}
  </MediaQuery>
  <form id="length">
    <div>
      <input
        type="radio"
        id="short"
        value="short"
        checked={selectedLength === 'short'}
        on:change={onChange}
      />
      <label for="short">Short</label>
    </div>
    <div>
      <input
        type="radio"
        id="medium"
        value="mid"
        checked={selectedLength === 'mid'}
        on:change={onChange}
      />
      <label for="medium">Medium</label>
    </div>
    <div>
      <input
        type="radio"
        id="long"
        value="long"
        checked={selectedLength === 'long'}
        on:change={onChange}
      />
      <label for="long">Long</label>
    </div>
  </form>
  <MediaQuery query="(max-width: 440px)" let:matches>
    {#if matches}
      <div id="bio"></div>
    {/if}
  </MediaQuery>
</div>

<style>
  #bio-container {
    display: flex;
  }

  #bio {
    overflow: hidden;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 1s;
    margin-right: 10px;
  }

  #length {
    padding: 5px;
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
    border: 2px solid var(--neutral-dark-gray-op-50);
  }

  #length div {
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }

  #length input {
    width: 20px;
    height: 20px;
    margin-right: 2px;
    border-radius: 5px;
    appearance: initial;
    background-color: var(--neutral-dark-gray);
    transition: background-color 0.5s;
  }

  #length input:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  #length input:checked {
    background-color: var(--main-blue);
  }

  @media screen and (max-width: 440px) {
    #bio-container {
      flex-direction: column;
    }

    #length {
      flex-direction: row;
    }
  }
</style>
