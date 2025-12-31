<script>
  import BlogPostForm from '$lib/components/BlogPostForm.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<div class="page-container">
  <h2>Edit Blog Post</h2>
  <BlogPostForm {data} {form} post={data.post} postTags={data.postTags} isEdit={true} />
</div>

<style>
  .page-container {
    max-width: 900px;
  }

  h2 {
    margin: 0 0 30px 0;
    color: var(--main-blue-light);
  }

  @media (max-width: 600px) {
    .page-container {
      padding: 15px;
    }
  }
</style>
