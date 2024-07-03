<script>
  import { goto } from '$app/navigation';

  export let title = 'Placeholder';
  export let description = 'Placeholder';
  export let started = 'Placeholder';
  export let ended = 'Placeholder';
  export let linkUrl = '';
</script>

<div>
  <div class="outer-boundary">
    <div class="card"> 
      <button
        on:click={() => {
          if (linkUrl !== '') {
            goto(linkUrl);
          }
        }}
      >
        <h2>{title}</h2>
        <p id="description">{description}</p>
      </button>
    </div>
  </div>
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

  /* width */
  p::-webkit-scrollbar {
    width: 6px;
  }

  /* Track */
  p::-webkit-scrollbar-track {
    background: #00000000;
  }

  /* Handle */
  p::-webkit-scrollbar-thumb {
    background: var(--main-blue);
    border-radius:10px;
  }

  /* Handle on hover */
  p::-webkit-scrollbar-thumb:hover {
    background: var(--main-blue-alt);
  }

  #description {
    text-align: left;
    white-space: pre-wrap;
    overflow-y: auto;
  }
</style>
