<script>
  // @ts-nocheck

  import experiences from './experiences.json';
  import Card from './card.svelte';

  let experienceList = experiences.other;
</script>

<div id="content">
  <h2>Experiments with Webdev!</h2>
    <div id="cards">
      {#each experienceList as experience}
        <Card
          title={experience.title}
          description={experience.description}
          linkUrl={experience.url}
          started={experience.startDate}
          ended={experience.endDate}
          image={experience.image}
          allowPopup={true}
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
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    width: fit-content;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    justify-content: space-around;
  }
</style>
