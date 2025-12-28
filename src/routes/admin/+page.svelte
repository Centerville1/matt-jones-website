<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<div class="dashboard">
  <h2>Dashboard</h2>

  <div class="stats-grid">
    <div class="stat-card">
      <h3>Portfolio Items</h3>
      <p class="stat-number">{data.stats.portfolioCount}</p>
      <a href="/admin/portfolio">Manage Items →</a>
    </div>

    <div class="stat-card">
      <h3>Images</h3>
      <p class="stat-number">{data.stats.imageCount}</p>
      <a href="/admin/images">Manage Images →</a>
    </div>

    <div class="stat-card">
      <h3>Categories</h3>
      <p class="stat-number">{data.stats.categoryCount}</p>
    </div>
  </div>

  <div class="quick-actions">
    <h3>Quick Actions</h3>
    <div class="action-buttons">
      <a href="/admin/portfolio/new" class="action-button">
        + New Portfolio Item
      </a>
      <a href="/admin/images" class="action-button"> + Upload Image </a>
    </div>
  </div>
</div>

<style>
  .dashboard {
    max-width: 1000px;
  }

  h2 {
    margin: 0 0 30px 0;
    color: var(--main-blue-light);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background-color: var(--neutral-gray);
    border: 2px solid var(--neutral-dark-gray-op-50);
    border-radius: 10px;
    padding: 25px;
    transition: transform 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
  }

  .stat-card h3 {
    margin: 0 0 15px 0;
    color: var(--neutral-black);
    font-size: 16px;
    font-weight: 500;
  }

  .stat-number {
    font-size: 36px;
    font-weight: bold;
    color: var(--main-blue);
    margin: 0 0 15px 0;
  }

  .stat-card a {
    color: var(--main-blue-light);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
  }

  .stat-card a:hover {
    color: var(--main-blue);
  }

  .quick-actions {
    background-color: var(--neutral-gray);
    border-radius: 10px;
    padding: 25px;
  }

  .quick-actions h3 {
    margin: 0 0 20px 0;
    color: var(--neutral-black);
  }

  .action-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .action-button {
    background-color: var(--main-blue);
    color: var(--contrast-text-dark);
    padding: 12px 24px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.5s;
  }

  .action-button:hover {
    background-color: var(--main-blue-alt);
  }
</style>
