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
  export let started = '';
  /**
   * @type {String | null}
   */
  export let ended = '';
  export let linkUrl = '';
  export let image = '';
  export let allowPopup = false;

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
  });
</script>

<div>
  {#if allowPopup}
    <PopupBox
      bind:this={popup}
      onClick={url}>
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
            src="/experiences/{image}"
            alt="Image uploaded to represent {title}"
          />
        </div>
      {/if}
      <p id="description">{description}</p>
    </PopupBox>
    <div class="outer-boundary" style="cursor: pointer;">
      <div class="card" title="click to expand"> 
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
    height: 450px;
    border-radius: 40px;
    border: 4px solid var(--main-blue-alt);
    background-color: var(--no-background);
    color: var(--contrast-text-light);
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    transition: background 0.5s cubic-bezier(.72,0,.83,.67);
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
    transition: background 0.3s cubic-bezier(.03,.38,.72,.71);
  }

  .instruction {
    margin-left: 20px;
  }

  #img-container {
    width: 100%;
  }

  img {
    border: 1px solid var(--contrast-text-light);
    border-radius: 7px;
    max-height: 100px;
    margin-left: auto;
    margin-right: auto;
  }

  #description {
    text-align: left;
    white-space: pre-wrap;
    overflow-y: hidden;
  }
</style>
