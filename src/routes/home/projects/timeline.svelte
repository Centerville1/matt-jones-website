<script>
  import experiences from './experiences.json';
  import TimelineItem from './timeline-item.svelte';

  let experienceList = experiences.experiences;
</script>

<div class="upper-container">
  <h2>Present Day</h2>
</div>
<div class="timeline">
  {#each experienceList as experience, i}
      <TimelineItem
        index={i}
        title={experience.title}
        description={experience.description}
        linkUrl={experience.url}
        maxHeight={300}
        started={experience.startDate}
        ended={experience.endDate}>
      </TimelineItem>
  {/each}
</div>

<style>
/* Original styling from https://www.w3schools.com/howto/howto_css_timeline.asp */
* {
  box-sizing: border-box;
  --timeline-color: var(--main-blue-light)
}

.upper-container {
  padding-left: 20px;
}

h2 {
  margin-bottom: 4px;
}

/* The actual timeline (the vertical ruler) */
.timeline {
  position: relative;
  max-width: 1200px;
  padding-top: 20px;
  padding-bottom: 20px;
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
