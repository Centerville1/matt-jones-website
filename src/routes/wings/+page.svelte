<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<svelte:head>
  <title>Wing Night</title>
</svelte:head>

<div class="page">
  <div class="card">
    <div class="logo">🍗</div>
    <h1>Wing Night</h1>

    <form method="POST" use:enhance>
      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}
      <label>
        <span class="sr-only">Password</span>
        <input
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
          required
        />
      </label>
      <button type="submit">Enter</button>
    </form>
  </div>
</div>

<style>
  .page {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1c1a17;
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }

  .card {
    width: 100%;
    max-width: 360px;
    text-align: center;
  }

  .logo {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
  }

  h1 {
    color: #f5f0e8;
    font-size: 1.8rem;
    margin: 0 0 2rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  input {
    width: 100%;
    padding: 0.9rem 1rem;
    font-size: 1rem;
    background: #2a2520;
    border: 1px solid #3d3630;
    border-radius: 10px;
    color: #f5f0e8;
    outline: none;
  }

  input:focus {
    border-color: #e8623a;
  }

  button {
    width: 100%;
    padding: 0.9rem;
    font-size: 1rem;
    font-weight: 600;
    background: #e8623a;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    min-height: 48px;
  }

  button:active {
    background: #c94e28;
  }

  .error {
    color: #ff7b5e;
    font-size: 0.9rem;
    margin: 0;
    padding: 0.6rem 0.8rem;
    background: rgba(232, 98, 58, 0.15);
    border-radius: 8px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
</style>
