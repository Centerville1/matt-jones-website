<script>
  import experiences from './experiences.json';
  import Highlighted from './highlighted.svelte';
  import Card from './card.svelte';

  let experienceList = experiences.experiences;
</script>

<Highlighted />
<div class="upper-container">
  <h1>All Experience</h1>
</div>
<div class="timeline">
  {#each experienceList as experience, i}
    <Card
      title={experience.title}
      image={experience.image}
      description={experience.description}
      linkUrl={experience.url}
      started={experience.startDate}
      ended={experience.endDate}
      minimizeHeight={true}
      allowPopup={true}
    ></Card>
  {/each}
</div>

<style>
  /* Original styling from https://www.w3schools.com/howto/howto_css_timeline.asp */
  * {
    box-sizing: border-box;
    --timeline-color: var(--main-blue-light);
  }

  .upper-container {
    padding-left: 20px;
    margin-bottom: 20px;
  }

  /* The actual timeline (the vertical ruler) */
  .timeline {
    position: relative;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    margin-left: 0;
    border-top: 6px solid var(--timeline-color);
    border-bottom: 6px solid var(--timeline-color);
    margin-bottom: 15px;
  }

  /* The actual timeline (the vertical ruler) */
  .timeline::after {
    content: '';
    position: absolute;
    width: 6px;
    background-color: var(--timeline-color);
    top: 0;
    bottom: 0;
    left: 31px;
    margin-left: -3px;
  }
</style>
