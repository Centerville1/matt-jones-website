<script>
  import { goto } from '$app/navigation';

  export let title = 'Placeholder';
  export let description = 'Placeholder';
  export let started = 'Placeholder';
  export let ended = 'Placeholder';
  export let linkUrl = '';
</script>

<button
  class="card"
  on:click={() => {
    if (linkUrl !== '') {
      goto(linkUrl);
    }
  }}
>
  <h3>{title}</h3>
  <p id="description">{description}</p>
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

  #description {
    text-align: left;
    white-space: pre-wrap;
    overflow-y: scroll;
  }
</style>
