<script>
  import experiences from './experiences.json';
  import Card from './card.svelte';

  let experienceList = experiences.experiences;
</script>

<div id="content">
  <h2>Highlighted Experiences</h2>
  <div id="cards-scrollbox">
    <div id="cards">
      {#each experienceList as experience}
        {#if experience.highlight}
          <Card
            title={experience.title}
            description={experience.description}
            linkUrl={experience.url}
          />
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  #content {
    width: 98%;
    margin-left: auto;
    margin-right: auto;
  }

  #cards-scrollbox {
    width: 100%;
    padding-bottom: 20px;
    overflow-x: scroll;
  }

  #cards {
    margin-left: auto;
    margin-right: auto;
    min-width: 60%;
    width: fit-content;
    display: flex;
    justify-content: space-around;
  }
</style>
