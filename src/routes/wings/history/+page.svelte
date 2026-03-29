<script>
  /** @type {import('./$types').PageData} */
  export let data;

  let expandedSession = /** @type {number|null} */ (null);

  $: sessions = data.sessions;
  $: attendanceStats = data.attendanceStats;
  $: wingStats = data.wingStats;

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  function toggleSession(id) {
    expandedSession = expandedSession === id ? null : id;
  }
</script>

<svelte:head>
  <title>Wing Night — History</title>
</svelte:head>

<div class="app">
  <header>
    <span class="logo">🍗</span>
    <span class="title">Wing Night</span>
    <a href="/wings/logout" class="logout">Out</a>
  </header>

  <nav>
    <a href="/wings/order">Order</a>
    <a href="/wings/history" class="active">History</a>
    <a href="/wings/manage">Manage</a>
  </nav>

  <main>
    <!-- Stats -->
    {#if sessions.length > 0}
      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{sessions.length}</span>
          <span class="stat-label">Wing Nights</span>
        </div>
        <div class="stat">
          <span class="stat-value">
            {sessions.reduce((s, n) => s + n.totalWings, 0)}
          </span>
          <span class="stat-label">Total Wings</span>
        </div>
        <div class="stat">
          <span class="stat-value">{attendanceStats.length}</span>
          <span class="stat-label">Regulars</span>
        </div>
      </div>

      <!-- Top attendees -->
      {#if attendanceStats.length > 0}
        <div class="section">
          <h2 class="section-title">Attendance</h2>
          <div class="leaderboard">
            {#each attendanceStats as person, i}
              <div class="lb-row">
                <span class="lb-rank">#{i + 1}</span>
                <span class="lb-name">{person.personName}</span>
                <span class="lb-count">{person.sessions} nights</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Wing leaders -->
      {#if wingStats.filter((p) => p.totalWings > 0).length > 0}
        <div class="section">
          <h2 class="section-title">Wing Leaders</h2>
          <div class="leaderboard">
            {#each wingStats.filter((p) => p.totalWings > 0) as person, i}
              <div class="lb-row">
                <span class="lb-rank">#{i + 1}</span>
                <span class="lb-name">{person.personName}</span>
                <span class="lb-count">{person.totalWings} wings</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}

    <!-- Sessions list -->
    <div class="section">
      <h2 class="section-title">Sessions</h2>

      {#if sessions.length === 0}
        <p class="empty">No sessions yet. <a href="/wings/order">Start one!</a></p>
      {:else}
        <div class="sessions">
          {#each sessions as session (session.id)}
            <div class="session-card">
              <button
                type="button"
                class="session-summary"
                on:click={() => toggleSession(session.id)}
              >
                <div class="session-left">
                  <span class="session-date">{formatDate(session.date)}</span>
                  <span class="session-restaurant">{session.restaurantName}</span>
                </div>
                <div class="session-right">
                  <span class="session-wings">{session.totalWings} wings</span>
                  <span class="session-attendees">{session.attendees.length} people</span>
                  <span class="chevron" class:open={expandedSession === session.id}>›</span>
                </div>
              </button>

              {#if expandedSession === session.id}
                <div class="session-detail">
                  <p class="detail-label">Attendees</p>
                  <p class="detail-names">{session.attendees.join(', ') || '—'}</p>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .app {
    min-height: 100dvh;
    background: #1c1a17;
    color: #f5f0e8;
    font-family: system-ui, sans-serif;
    font-size: 1rem;
    max-width: 640px;
    margin: 0 auto;
  }

  header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #13120f;
    border-bottom: 1px solid #2a2520;
  }

  .logo { font-size: 1.3rem; }
  .title { font-weight: 700; font-size: 1.1rem; flex: 1; }

  .logout {
    color: #8a7d6e;
    text-decoration: none;
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid #3d3630;
    border-radius: 6px;
    min-height: 36px;
    display: flex;
    align-items: center;
  }

  nav {
    display: flex;
    border-bottom: 1px solid #2a2520;
  }

  nav a {
    flex: 1;
    text-align: center;
    padding: 0.75rem;
    color: #8a7d6e;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  nav a.active,
  nav a:hover {
    color: #e8623a;
    border-bottom: 2px solid #e8623a;
  }

  main {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ─── Stats ──────────────────────────────────────── */
  .stats-row {
    display: flex;
    gap: 0.5rem;
  }

  .stat {
    flex: 1;
    background: #2a2520;
    border-radius: 12px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .stat-value {
    font-size: 1.6rem;
    font-weight: 700;
    color: #e8623a;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #8a7d6e;
    text-align: center;
  }

  /* ─── Section ────────────────────────────────────── */
  .section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8a7d6e;
    margin: 0;
  }

  /* ─── Leaderboard ────────────────────────────────── */
  .leaderboard {
    background: #2a2520;
    border-radius: 12px;
    overflow: hidden;
  }

  .lb-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #3d3630;
  }

  .lb-row:last-child {
    border-bottom: none;
  }

  .lb-rank {
    font-size: 0.8rem;
    color: #8a7d6e;
    min-width: 2rem;
  }

  .lb-name {
    flex: 1;
    font-size: 0.95rem;
  }

  .lb-count {
    font-size: 0.85rem;
    color: #e8623a;
    font-weight: 600;
  }

  /* ─── Sessions ───────────────────────────────────── */
  .sessions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .session-card {
    background: #2a2520;
    border-radius: 12px;
    overflow: hidden;
  }

  .session-summary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1rem;
    background: none;
    border: none;
    color: #f5f0e8;
    text-align: left;
    cursor: pointer;
    min-height: 60px;
    gap: 0.5rem;
  }

  .session-left {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .session-date {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .session-restaurant {
    font-size: 0.8rem;
    color: #8a7d6e;
  }

  .session-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .session-wings {
    font-size: 0.8rem;
    color: #e8623a;
    font-weight: 600;
  }

  .session-attendees {
    font-size: 0.8rem;
    color: #8a7d6e;
  }

  .chevron {
    font-size: 1.1rem;
    color: #8a7d6e;
    transition: transform 0.2s;
    display: inline-block;
  }

  .chevron.open {
    transform: rotate(90deg);
  }

  .session-detail {
    padding: 0.75rem 1rem 1rem;
    border-top: 1px solid #3d3630;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .detail-label {
    font-size: 0.75rem;
    color: #8a7d6e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
  }

  .detail-names {
    font-size: 0.95rem;
    margin: 0;
    color: #c8bfb0;
  }

  .empty {
    color: #8a7d6e;
    text-align: center;
    padding: 2rem;
  }

  .empty a {
    color: #e8623a;
  }
</style>
