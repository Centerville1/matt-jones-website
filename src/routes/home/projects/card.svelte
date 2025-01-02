<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import PopupBox from '../../popup-box.svelte';

  /**
   * @type {PopupBox}
   */
  let popup;

  export let title = 'Placeholder';
  export let description = 'Placeholder';
    /**
   * @type {String | null}
   */
  export let started = '';
  /**
   * @type {String | null}
   */
  export let ended = '';
  export let linkUrl = '';
  export let image = '';
  export let allowPopup = false;
  export let minimizeHeight = false;

  /**
   * @type {Date | null}
   */
  let startDate = null;

  /**
   * @type {string}
   */
  let startMonth;

  if (started !== '' && started !== null) {
    let mon1 = parseInt(started.substring(0, 2));
    let dt1 = parseInt(started.substring(3, 5));
    let yr1 = parseInt(started.substring(6, 10));
    startDate = new Date(yr1, mon1 - 1, dt1);
    startMonth = startDate.toLocaleString('default', { month: 'long' });
  }

  /**
   * @type {Date | null}
   */
  let endDate;

  /**
   * @type {string}
   */
  let endMonth;

  if (ended !== '' && ended !== null) {
    let mon1 = parseInt(ended.substring(0, 2));
    let dt1 = parseInt(ended.substring(3, 5));
    let yr1 = parseInt(ended.substring(6, 10));
    endDate = new Date(yr1, mon1 - 1, dt1);
    endMonth = endDate.toLocaleString('default', { month: 'long' });
  } else {
    // @ts-ignore
    endDate = 'Present';
  }

    /**
   * @type {string | (() => void)}
   */
  let url = "";

  /**
   * @type HTMLElement | null
   */
  let thisCard = null;

  onMount(() => {
    if (linkUrl !== "") {
      url = () => {
        if (linkUrl !== '') {
          if (linkUrl.startsWith('https://')) {
            // @ts-ignore
            window.location = linkUrl;
          } else {
            goto(linkUrl);
          }
        }
      }
    }
    if (minimizeHeight && thisCard) {
      thisCard.style.height = "fit-content"
    }
    else if (thisCard) {
      thisCard.style.height = "450px"
    }
  });
</script>

<div>
  {#if allowPopup}
    <PopupBox
      bind:this={popup}
      onClick={url}
      >
      <div class="popup">
        <h2>{title}</h2>
        {#if startDate !== null}
          {#if typeof(endDate) !== typeof("") && endDate !== null}
            <h4>
              {startMonth}
              {startDate.getFullYear()} - {endMonth}
              {endDate.getFullYear()}
            </h4>
          {:else}
            <h4>
              {startMonth}
              {startDate.getFullYear()} - {endDate}
            </h4>
          {/if}
        {/if}
        <div class="popup-content">
          {#if image !== ''}
            <div id="img-container">
              <img
                class="popup-image"
                src="/experiences/{image}"
                alt="Image uploaded to represent {title}"
              />
            </div>
          {/if}
          <p>{description}</p>
        </div>
      </div>
    </PopupBox>
    <div class="outer-boundary" style="cursor: pointer;">
      <div class="card" id="card" title="click to expand" bind:this={thisCard}> 
        <button
          on:click={() => {popup.openPopup()}}
          style="cursor: pointer;"
        >
          <h2>{title}</h2>
          {#if startDate !== null}
            {#if typeof(endDate) !== typeof("") && endDate !== null}
              <h5>
                {startMonth}
                {startDate.getFullYear()} - {endMonth}
                {endDate.getFullYear()}
              </h5>
            {:else}
              <h5>
                {startMonth}
                {startDate.getFullYear()} - {endDate}
              </h5>
            {/if}
          {/if}
          {#if image !== ''}
            <div id="img-container">
              <img
                class={minimizeHeight ? "image-wide" : "image"}
                src="/experiences/{image}"
                alt="Image uploaded to represent {title}"
              />
            </div>
          {/if}
          <p id="description">{description}</p>
        </button>
        <h4 class="instruction">Click to Expand</h4>
      </div>
    </div>
  {:else}
    <div class="outer-boundary">
      <div class="card"> 
        <button
          on:click={() => {
            if (linkUrl !== '') {
              if (linkUrl.startsWith('https://')) {
                // @ts-ignore
                window.location = linkUrl;
              } else {
                goto(linkUrl);
              }
            }
          }}
        >
          <h2>{title}</h2>
          {#if startDate !== null}
            {#if typeof(endDate) !== typeof("") && endDate !== null}
              <h5>
                {startMonth}
                {startDate.getFullYear()} - {endMonth}
                {endDate.getFullYear()}
              </h5>
            {:else}
              <h5>
                {startMonth}
                {startDate.getFullYear()} - {endDate}
              </h5>
            {/if}
          {/if}
          {#if image !== ''}
            <div id="img-container">
              <img 
                class={minimizeHeight ? "image-wide" : "image"}
                src="/experiences/{image}"
                alt="Image uploaded to represent {title}"
              />
            </div>
          {/if}
          <p id="description">{description}</p>
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .outer-boundary {
    padding-left:2%;
    padding-right:2%;
  }

  .card {
    border-radius: 40px;
    border: 4px solid var(--main-blue-alt);
    background-color: var(--no-background);
    color: var(--contrast-text-light);
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    transition: background 0.25s cubic-bezier(.72,0,.83,.67);
    transition: transform .2s ease-out;
  }

  .card button {
    display: flex;
    align-items: start;
    flex-direction: column;
    background-color: var(--no-background);
    font-size: inherit;
    color: inherit;
    height: 97%;
    overflow: hidden;
  }

  .card:hover {
    background-color: var(--main-blue-alt);
    transform: scale(1.01);
  }

  .instruction {
    margin-left: 20px;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .popup-image {
    border: 1px solid var(--contrast-text-light);
    border-radius: 7px;
    max-height: 250px;
    max-width: 25vw;
    float: left;
  }

  .image {
    border: 1px solid var(--contrast-text-light);
    border-radius: 7px;
    max-width: 90%;
    max-height: 100px;
    margin-left: auto;
    margin-right: auto;
  }

  .image-wide {
    border: 1px solid var(--contrast-text-light);
    border-radius: 7px;
    max-height: 150px;
    float: left;
  }

  #description {
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .popup {
    display: flex;
    flex-direction: column;
  }

  .popup-content {
    display: flex;
    justify-content: flex-start;
    column-gap: 30px;
  }

  .popup p {
    text-align: center;
    font-size: large;
  }

  @media screen and (max-width: 950px) {
    .popup-content {
      display: flex;
      flex-direction: column;
      row-gap: 20px;
    }
    .popup-image {
      max-width: 100%;
    }
  }
</style>
