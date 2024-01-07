<script>
  import { onMount } from 'svelte';
  import { bios, stringTransformSteps } from './bio';
  import { browser } from '$app/environment';

  /**
   * @type {string[]}
   */
  let currentBios = [];

  let selectedLength = 'mid';

  /**
   * @param {string[]} bioArray
   */
  function generateBio(bioArray) {
    // console.log(bioArray);
    if (!browser) return;
    currentBios = bioArray;
    const bio = document.getElementById('bio');
    if (bio !== null) {
      bio.innerHTML = '';
      for (let i = 0; i < bioArray.length; i++) {
        if (bioArray[i].trim() !== '') {
          let paragraph = document.createElement('p');
          // console.log(bioArray[i], typeof bioArray[i], bioArray[i] === '');
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
      setTimeout(
        () => {
          animateTransformation(eachSteps, currLength);
        },
        Math.round(Math.random() * 50),
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
  }
</script>

<div id="bio-container">
  <div id="bio"></div>

  <form id="length">
    <label for="short">Short</label>
    <input
      type="radio"
      id="short"
      value="short"
      checked={selectedLength === 'short'}
      on:change={onChange}
    />
    <label for="medium">Medium</label>
    <input
      type="radio"
      id="medium"
      value="mid"
      checked={selectedLength === 'mid'}
      on:change={onChange}
    />
    <label for="long">Long</label>
    <input
      type="radio"
      id="long"
      value="long"
      checked={selectedLength === 'long'}
      on:change={onChange}
    />
  </form>
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
    margin-right: 20px;
  }

  #length {
    display: flex;
    flex-direction: column;
    width: fit-content;
  }

  #length input {
    width: 20px;
    height: 20px;
    border-radius: 0;
    appearance: initial;
    background-color: var(--neutral-dark-gray);
    transition: background-color 0.5s;
  }

  #length input:hover {
    background-color: var(--neutral-dark-gray-op-50);
  }

  #length input:checked {
    background-color: var(--green);
  }
</style>
