<script>
  import experiences from './experiences.json';
  import Card from './card.svelte';

  let projects = experiences.projects;
</script>

<div id="content">
  <div class="upper-container">
    <h2>My Projects</h2>
    <p>These are the various projects and programs I've worked on.</p>
    <h4>
      See <a href="/home/projects#timeline">My Experience</a> for a more detailed
      overview of my experience.
    </h4>
    <hr />
  </div>
  <div id="projects-box">
    {#each projects as project}
      <Card
        title={project.title}
        description={project.description}
        linkUrl={project.url}
        started={project.startDate || undefined}
        ended={project.endDate}
        image={project.image}
        allowPopup={true}
      />
    {/each}
  </div>
</div>

<style>
  #content {
    width: 97%;
    margin-left: auto;
    margin-right: auto;
  }

  #projects-box {
    padding-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
</style>
