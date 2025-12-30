<script>
  // @ts-nocheck

  import Card from './card.svelte';

  export let experiences;
  let experienceList = experiences.other;
</script>

<div id="content">
  <h2>Experiments with Webdev!</h2>
  <p>
    Browse the list below to check out all web development experiments, and
    miscellaneous other projects!
  </p>
  <hr />
  <div id="cards">
    {#each experienceList as experience}
      <Card
        title={experience.title}
        description={experience.description}
        linkUrl={experience.url}
        started={experience.startDate}
        ended={experience.endDate}
        image={experience.image}
      />
    {/each}
  </div>
</div>

<style>
  #content {
    width: 98%;
    margin-left: auto;
    margin-right: auto;
  }

  #cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    justify-content: space-around;
  }
</style>
