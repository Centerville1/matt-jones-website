<script>
  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<div class="login-container">
  <div class="login-card">
    <h1>Admin Login</h1>

    <form method="POST">
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autocomplete="current-password"
        />
      </div>

      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}

      <button type="submit">Login</button>
    </form>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--neutral-gray);
    padding: 20px;
  }

  .login-card {
    background-color: var(--neutral-dark-gray);
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    padding: 40px;
    max-width: 400px;
    width: 100%;
  }

  h1 {
    margin: 0 0 30px 0;
    text-align: center;
    color: var(--neutral-white);
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: var(--neutral-white);
    font-weight: 500;
  }

  input[type='password'] {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    background-color: var(--neutral-gray);
    color: var(--neutral-white);
    font-size: 16px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  input[type='password']:focus {
    outline: none;
    border-color: var(--main-blue);
  }

  button {
    width: 100%;
    padding: 12px;
    background-color: var(--main-blue);
    color: var(--neutral-white);
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.5s;
  }

  button:hover {
    background-color: var(--main-blue-alt);
  }

  .error {
    color: var(--red);
    margin: 10px 0;
    padding: 10px;
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
  }
</style>
