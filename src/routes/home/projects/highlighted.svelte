<script>
  import experiences from './experiences.json';
  import Card from './card.svelte';

  let experienceList = experiences.experiences;

  let countHighlights = 0;
  for (let experience of experienceList) {
    if (experience.highlight) {
      countHighlights++;
    }
  }
</script>

<div id="content">
  <h2>Highlighted Experiences</h2>
  <div id="cards-scrollbox">
    <div id="cards">
      {#if countHighlights > 0}
        {#each experienceList as experience}
          {#if experience.highlight}
            <Card
              title={experience.title}
              description={experience.description}
              linkUrl={experience.url}
            />
          {/if}
        {/each}
      {:else}
        <Card
          title={'No Highlighted Experiences!'}
          description={'    "Click this card" to navigate to the TIMELINE TAB to see all my projects and positions'}
          linkUrl={'/home/projects#timeline'}
        />
      {/if}
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
