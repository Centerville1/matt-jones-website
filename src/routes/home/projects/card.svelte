<script>
  import { goto } from '$app/navigation';

  export let title = 'Placeholder';
  export let description = 'Placeholder';
  export let started = '';
  export let ended = '';
  export let linkUrl = '';
  export let image = '';

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
   * @type {string | Date}
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
    endDate = 'Present';
  }
</script>

<button
  class="card"
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
  <h3>{title}</h3>
  {#if startDate !== null}
    {#if endDate !== 'Present'}
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
    <div>
      <img
        src="/experiences/{image}"
        alt="Image uploaded to represent {title}"
      />
    </div>
  {/if}
  <div>
    <p id="description">{description}</p>
  </div>
</button>

<style>
  .card {
    height: 450px;
    width: 300px;
    border-radius: 10px;
    background-color: var(--neutral-dark-gray);
    color: var(--contrast-text-light);
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 30px;
    padding: 5px;
  }

  .card:hover {
    background-color: var(--main-blue-alt);
  }

  img {
    width: 90%;
  }

  #description {
    text-align: left;
    white-space: pre-wrap;
    overflow-y: scroll;
  }
</style>
