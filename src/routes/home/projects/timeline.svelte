<script>
  import experiences from './experiences.json';
  import TimelineItem from './timeline-item.svelte';

  let experienceList = experiences.experiences;
</script>

<div class="timeline">
  {#each experienceList as experience, i}
    {#if i % 2 === 0}
      <TimelineItem
      index={i}
      title={experience.title}
      description={experience.description}
      linkUrl={experience.url}>
      </TimelineItem>
    {:else}
      <TimelineItem
        index={i}
        left={false} 
        title={experience.title}
        description={experience.description}>
      </TimelineItem>
    {/if}
  {/each}
</div>

<style>
/* Original styling from https://www.w3schools.com/howto/howto_css_timeline.asp */
* {
  box-sizing: border-box;
  --box-background: var(--neutral-black)
}

/* The actual timeline (the vertical ruler) */
.timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

/* The actual timeline (the vertical ruler) */
.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: var(--box-background);
  opacity: 50%; 
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -3px;
}



/* Media queries - Responsive timeline on screens less than 600px wide */
@media screen and (max-width: 600px) {
/* Place the timelime to the left */
  .timeline::after {
    left: 31px;
  }
}
</style>
