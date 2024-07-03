<script>
  import experiences from './experiences.json';
  import Card from './card.svelte';
  import Carousel from 'svelte-carousel';
  import MediaQuery from 'svelte-media-query';

  let carousel; // for calling methods of the carousel instance
  
  const handleNextClick = () => {
    carousel.goToNext()
  }

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
    <h2>Highlighted Experiences</h2>
  </div>
  <div id="upper-content">
    <div id="carousel-box">
      <MediaQuery query="(min-width: 700px)" let:matches>
        {#if matches}
          <Carousel
            bind:this={carousel}
            particlesToShow={2}
            autoplay={true}
            autoplayDuration={4000}
            autoplayProgressVisible={true}
            duration={1000}
            pauseOnFocus={true}
            infinite={true}
          >
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
          </Carousel>
        {:else}
          <Carousel
            bind:this={carousel}
            particlesToShow={1}
            autoplay={true}
            autoplayDuration={4000}
            autoplayProgressVisible={true}
            duration={1000}
            pauseOnFocus={true}
            infinite={true}
          >
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
          </Carousel>
        {/if}
        </MediaQuery>
    </div>
  </div>
</div>

<style>

  .upper-container {
    padding-left: 20px;
  }

  #upper-content {
    border-top: 6px solid var(--main-blue-light);
    border-bottom: 6px solid var(--main-blue-light);
  }

  #carousel-box {
    width:95%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
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
