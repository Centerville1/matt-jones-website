<script>
  import experiences from './experiences.json';
  import Card from './card.svelte';
  import MediaQuery from 'svelte-media-query';

  let experienceList = experiences.experiences;

  let countHighlights = 0;
  for (let experience of experienceList) {
    if (experience.highlight) {
      countHighlights++;
    }
  }
</script>

<div id="content">
  <div class="upper-container">
    <h2>Highlights</h2>
    <hr />
  </div>
    <div id="carousel-box">
      <MediaQuery query="(min-width: 700px)" let:matches>
        {#if matches}
            {#if countHighlights > 0}
              {#each experienceList as experience}
                {#if experience.highlight}
                  <Card
                    title={experience.title}
                    description={experience.description}
                    linkUrl={experience.url}
                    started={experience.startDate || undefined}
                    ended={experience.endDate}
                    image={experience.image}
                    allowPopup={true}
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
        {:else}
            {#if countHighlights > 0}
              {#each experienceList as experience}
                {#if experience.highlight}
                  <Card
                  title={experience.title}
                  description={experience.description}
                  linkUrl={experience.url}
                  started={experience.startDate || undefined}
                  ended={experience.endDate}
                  image={experience.image}
                  allowPopup={true}
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
        {/if}
        </MediaQuery>
    </div>
</div>

<style>
  #content {
    width:98%;
    margin-left: auto;
    margin-right: auto;
  }

  #carousel-box {
    width:95%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>
