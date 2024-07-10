<script>
  import BlogPage from "../../blogPage.svelte";
</script>

<BlogPage title="Site Implementation" subtitle="How I built my site" background="checker">
  <h3>Tech Used:</h3>
  <ul>
    <li>SvelteKit - JS framework, frontend and backend structure</li>
    <li>Vercel - Web hosting and analytics</li>
    <li>Prisma (Coming Soon) - Database management</li>
  </ul>

  <div class="spacing" />

  <h3>SvelteKit</h3>
  <img src="/sveltekit.png" alt="SvelteKit logo"/>
  <p>This site is built using <a href="https://kit.svelte.dev/">SvelteKit</a>.  </p>

  <div class="spacing" />

  <h3>Color and Styling</h3>
  <p>I'm particularly interested in ways of handling color palettes and css colors.
    Ever since working on the dark mode project on Gordon 360 
    (see <a href="/home/projects">projects</a>).
  </p>
  <p>This site uses CSS custom properties to store all of the colors across the site.
    This makes it easy to modify the site colors in one spot, and let them update
    everywhere.  It also allows you to switch between theme modes (i.e. light/dark).
    This site has all the systems for switching color modes, but I've disabled it for now 
    for ease of development (and because I just prefer dark mode, being a software developer, 
    I'm biased I know).
  </p>

  <div class="spacing" />

  <h3>Architecture</h3>
  <p>As of summer 2024, this site has no API or database, and is purely a frontent app
    using JavaScript, HTML, and CSS in the context of SvelteKit.
    It is a goal of mine to add a database in the near future to more easily store and 
    update site data and pages with some sort of admin view (this would also enable 
    several other potential features).
  </p>
</BlogPage>
