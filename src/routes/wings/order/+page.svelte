<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').PageData} */
  export let data;

  let editingPersonId = /** @type {number|null} */ (null);
  let showWaiterView = false;
  let waiterViewMode = 'combined'; // 'combined' | 'individual'
  let personQuery = '';
  let showDropdown = false;
  let selectedExistingPersonId = /** @type {number|null} */ (null);

  $: session = data.session;
  $: people = data.people;
  $: menuItems = data.menuItems;
  $: allPeople = data.allPeople;
  $: restaurants = data.restaurants;
  $: today = data.today;

  $: filteredPeople = allPeople
    .filter((p) => p.name.toLowerCase().includes(personQuery.toLowerCase()))
    .slice(0, 6);

  $: editingPerson = people.find((p) => p.personId === editingPersonId) ?? null;
  $: sessionPeopleIds = people.map((p) => p.personId);

  // Combined order: sum all items across all people, sorted by qty desc
  $: combinedOrder = (() => {
    /** @type {Map<number, { menuItemName: string, quantity: number }>} */
    const map = new Map();
    for (const person of people) {
      for (const item of person.items) {
        const existing = map.get(item.menuItemId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          map.set(item.menuItemId, { menuItemName: item.menuItemName, quantity: item.quantity });
        }
      }
    }
    return [...map.values()].sort((a, b) => b.quantity - a.quantity);
  })();

  function getItemQty(person, menuItemId) {
    return person.items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0;
  }

  function totalWings(person) {
    return person.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }

  const refresh = () => async ({ update }) => update({ reset: false });

  function pickExistingPerson(person) {
    selectedExistingPersonId = person.id;
    personQuery = person.name;
    showDropdown = false;
  }

  function clearPersonInput() {
    personQuery = '';
    selectedExistingPersonId = null;
  }
</script>

<svelte:head>
  <title>Wing Night — Order</title>
</svelte:head>

<div class="app">
  <!-- Header -->
  <header>
    <span class="logo">🍗</span>
    <span class="title">Wing Night</span>
    <a href="/wings/logout" class="logout">Out</a>
  </header>

  <!-- Nav -->
  <nav>
    <a href="/wings/order" class="active">Order</a>
    <a href="/wings/history">History</a>
    <a href="/wings/manage">Manage</a>
  </nav>

  <main>
    <!-- No restaurants yet -->
    {#if restaurants.length === 0}
      <div class="empty-state">
        <p>No restaurants yet.</p>
        <a href="/wings/manage" class="btn">Add a Restaurant</a>
      </div>

    <!-- No session today — start one -->
    {:else if !session}
      <div class="start-section">
        <h2>Start Tonight's Session</h2>
        <form method="POST" action="?/startSession" use:enhance={refresh}>
          <label class="field-label">
            Restaurant
            <select name="restaurantId" required>
              <option value="">Pick a restaurant…</option>
              {#each restaurants as r}
                <option value={r.id}>{r.name}</option>
              {/each}
            </select>
          </label>
          <label class="field-label">
            Date
            <input type="date" name="date" value={today} required />
          </label>
          <button type="submit" class="btn-primary">Start Wing Night</button>
        </form>
      </div>

    <!-- Session active -->
    {:else}
      <!-- Session info -->
      <div class="session-info">
        <div class="session-meta">
          <strong>{session.restaurantName}</strong>
          <span>{formatDate(session.date)}</span>
        </div>
        <button class="waiter-btn" type="button" on:click={() => (showWaiterView = true)}>
          Show Waiter
        </button>
      </div>

      <!-- People list -->
      {#each people as person (person.personId)}
        <div class="person-card">
          <div class="person-header">
            <span class="person-name">{person.personName}</span>
            <span class="wing-count">{totalWings(person)} wings</span>
            <form method="POST" action="?/removePerson" use:enhance={refresh}>
              <input type="hidden" name="sessionId" value={session.id} />
              <input type="hidden" name="personId" value={person.personId} />
              <button
                type="submit"
                class="remove-person"
                aria-label="Remove {person.personName}"
                on:click|preventDefault={(e) => {
                  if (confirm(`Remove ${person.personName} and their order?`)) e.currentTarget.form.requestSubmit();
                }}
              >×</button>
            </form>
          </div>

          {#if person.items.length > 0}
            <ul class="order-list">
              {#each person.items as item (item.entryId)}
                <li class="order-item">
                  <span class="item-name">{item.menuItemName}</span>
                  <span class="item-qty">×{item.quantity}</span>
                  <form method="POST" action="?/removeItem" use:enhance={refresh}>
                    <input type="hidden" name="entryId" value={item.entryId} />
                    <button
                      type="submit"
                      class="remove-item"
                      aria-label="Remove item"
                      on:click|preventDefault={(e) => {
                        if (confirm(`Remove ${item.menuItemName}?`)) e.currentTarget.form.requestSubmit();
                      }}
                    >×</button>
                  </form>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="no-items">No items yet</p>
          {/if}

          <button
            type="button"
            class="edit-order-btn"
            on:click={() => (editingPersonId = person.personId)}
          >
            Edit Order
          </button>
        </div>
      {/each}

      <!-- Add person -->
      <div class="add-person-section">
        <form
          method="POST"
          action="?/addPerson"
          use:enhance={() => async ({ result, update }) => {
            await update({ reset: false });
            clearPersonInput();
            if (result.type === 'success' && result.data?.personId) {
              editingPersonId = result.data.personId;
            }
          }}
        >
          <input type="hidden" name="sessionId" value={session.id} />
          {#if selectedExistingPersonId}
            <input type="hidden" name="personId" value={selectedExistingPersonId} />
          {/if}

          <div class="person-input-wrap">
            <input
              type="text"
              name="name"
              placeholder="Add person…"
              value={personQuery}
              autocomplete="off"
              on:focus={() => (showDropdown = true)}
              on:input={(e) => {
                personQuery = e.currentTarget.value;
                selectedExistingPersonId = null;
                showDropdown = true;
              }}
              on:blur={() => setTimeout(() => (showDropdown = false), 150)}
            />
            {#if showDropdown && filteredPeople.length > 0}
              <ul class="dropdown">
                {#each filteredPeople as p}
                  {#if !sessionPeopleIds.includes(p.id)}
                    <li>
                      <button type="button" on:click={() => pickExistingPerson(p)}>
                        {p.name}
                      </button>
                    </li>
                  {/if}
                {/each}
              </ul>
            {/if}
          </div>
          <button type="submit" class="add-person-btn" disabled={!personQuery.trim()}>Add</button>
        </form>
      </div>
    {/if}
  </main>
</div>

<!-- Full-screen per-person order form -->
{#if editingPersonId && editingPerson && session}
  <div class="fullscreen-order">
    <div class="fullscreen-header">
      <button type="button" class="done-btn" on:click={() => (editingPersonId = null)}>
        ← Done
      </button>
      <span class="fullscreen-name">{editingPerson.personName}</span>
    </div>
    <div class="fs-total-bar">
      <span class="fs-total-number">{totalWings(editingPerson)}</span>
      <span class="fs-total-label">wings</span>
    </div>

    {#if menuItems.length === 0}
      <div class="fullscreen-empty">
        <p>No menu items for this restaurant.</p>
        <a href="/wings/manage">Add items in Manage</a>
      </div>
    {:else}
      <div class="fullscreen-items">
        {#each menuItems as item (item.id)}
          {@const qty = getItemQty(editingPerson, item.id)}
          <div class="fs-row">
            <div class="fs-item-info">
              <span class="fs-item-name">{item.name}</span>
              {#if item.priceInCents}
                <span class="fs-item-price">${(item.priceInCents / 100).toFixed(2)}</span>
              {/if}
            </div>
            <div class="fs-controls">
              <!-- Subtract buttons -->
              <form method="POST" action="?/addItem" use:enhance={refresh}>
                <input type="hidden" name="sessionId" value={session.id} />
                <input type="hidden" name="personId" value={editingPersonId} />
                <input type="hidden" name="menuItemId" value={item.id} />
                <input type="hidden" name="increment" value="-5" />
                <button type="submit" class="qty-btn minus" disabled={qty < 5}>−5</button>
              </form>
              <form method="POST" action="?/addItem" use:enhance={refresh}>
                <input type="hidden" name="sessionId" value={session.id} />
                <input type="hidden" name="personId" value={editingPersonId} />
                <input type="hidden" name="menuItemId" value={item.id} />
                <input type="hidden" name="increment" value="-1" />
                <button type="submit" class="qty-btn minus" disabled={qty < 1}>−1</button>
              </form>

              <span class="qty-display" class:qty-zero={qty === 0}>{qty}</span>

              <!-- Add buttons -->
              <form method="POST" action="?/addItem" use:enhance={refresh}>
                <input type="hidden" name="sessionId" value={session.id} />
                <input type="hidden" name="personId" value={editingPersonId} />
                <input type="hidden" name="menuItemId" value={item.id} />
                <input type="hidden" name="increment" value="1" />
                <button type="submit" class="qty-btn plus">+1</button>
              </form>
              <form method="POST" action="?/addItem" use:enhance={refresh}>
                <input type="hidden" name="sessionId" value={session.id} />
                <input type="hidden" name="personId" value={editingPersonId} />
                <input type="hidden" name="menuItemId" value={item.id} />
                <input type="hidden" name="increment" value="5" />
                <button type="submit" class="qty-btn plus">+5</button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<!-- Waiter view overlay -->
{#if showWaiterView && session}
  <div class="waiter-overlay">
    <div class="waiter-header">
      <div class="waiter-title">
        <strong>{session.restaurantName}</strong>
        <span>{formatDate(session.date)}</span>
      </div>
      <div class="waiter-controls">
        <div class="mode-toggle">
          <button
            type="button"
            class:active={waiterViewMode === 'combined'}
            on:click={() => (waiterViewMode = 'combined')}
          >Combined</button>
          <button
            type="button"
            class:active={waiterViewMode === 'individual'}
            on:click={() => (waiterViewMode = 'individual')}
          >Individual</button>
        </div>
        <button type="button" class="close-btn" on:click={() => (showWaiterView = false)}>Close</button>
      </div>
    </div>

    <div class="waiter-body">
      {#if waiterViewMode === 'combined'}
        {#if combinedOrder.length === 0}
          <p class="waiter-empty">No items ordered yet.</p>
        {:else}
          <ul class="combined-list">
            {#each combinedOrder as item}
              <li class="combined-item">
                <span class="combined-name">{item.menuItemName}</span>
                <span class="combined-qty">× {item.quantity}</span>
              </li>
            {/each}
          </ul>
          <p class="combined-total">
            Total: {combinedOrder.reduce((s, i) => s + i.quantity, 0)} wings
          </p>
        {/if}
      {:else}
        {#each people as person}
          {#if person.items.length > 0}
            <div class="waiter-person">
              <strong class="waiter-person-name">{person.personName}</strong>
              <ul class="waiter-items">
                {#each person.items as item}
                  <li>{item.menuItemName} × {item.quantity}</li>
                {/each}
              </ul>
            </div>
          {/if}
        {/each}
        {#if people.every((p) => p.items.length === 0)}
          <p class="waiter-empty">No items ordered yet.</p>
        {/if}
      {/if}
    </div>
  </div>
{/if}

<style>
  /* ─── Base ───────────────────────────────────────── */
  .app {
    min-height: 100dvh;
    background: #1c1a17;
    color: #f5f0e8;
    font-family: system-ui, sans-serif;
    font-size: 1rem;
    max-width: 640px;
    margin: 0 auto;
  }

  /* ─── Header ─────────────────────────────────────── */
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

  /* ─── Nav ────────────────────────────────────────── */
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

  nav a.active, nav a:hover {
    color: #e8623a;
    border-bottom: 2px solid #e8623a;
  }

  /* ─── Main ───────────────────────────────────────── */
  main {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* ─── Empty / Start ──────────────────────────────── */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #8a7d6e;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .start-section {
    background: #2a2520;
    border-radius: 14px;
    padding: 1.25rem;
  }

  .start-section h2 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
  }

  .start-section form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .field-label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.85rem;
    color: #8a7d6e;
  }

  .field-label select,
  .field-label input[type='date'] {
    padding: 0.7rem 0.8rem;
    background: #1c1a17;
    border: 1px solid #3d3630;
    border-radius: 8px;
    color: #f5f0e8;
    font-size: 1rem;
    min-height: 48px;
  }

  .btn {
    padding: 0.7rem 1.2rem;
    background: #2a2520;
    color: #f5f0e8;
    border: 1px solid #3d3630;
    border-radius: 10px;
    text-decoration: none;
    font-size: 0.95rem;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
  }

  .btn-primary {
    padding: 0.8rem;
    background: #e8623a;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 52px;
    width: 100%;
  }

  .btn-primary:active { background: #c94e28; }

  /* ─── Session info ───────────────────────────────── */
  .session-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .session-meta { display: flex; flex-direction: column; gap: 0.1rem; }
  .session-meta strong { font-size: 1.1rem; }
  .session-meta span { font-size: 0.85rem; color: #8a7d6e; }

  .waiter-btn {
    padding: 0.6rem 1rem;
    background: #e8623a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
    white-space: nowrap;
  }

  /* ─── Person card ────────────────────────────────── */
  .person-card {
    background: #2a2520;
    border-radius: 14px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .person-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .person-name { font-size: 1.1rem; font-weight: 700; flex: 1; }

  .wing-count {
    font-size: 0.8rem;
    color: #e8623a;
    background: rgba(232, 98, 58, 0.15);
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
  }

  .remove-person {
    background: none;
    border: none;
    color: #8a7d6e;
    font-size: 1.3rem;
    cursor: pointer;
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .remove-person:active { color: #ff6b4a; }

  .order-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .order-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid #3d3630;
  }

  .order-item:last-child { border-bottom: none; }

  .item-name { flex: 1; font-size: 0.95rem; }

  .item-qty {
    font-size: 0.9rem;
    color: #e8623a;
    font-weight: 600;
    min-width: 2.5rem;
    text-align: right;
  }

  .remove-item {
    background: none;
    border: none;
    color: #8a7d6e;
    cursor: pointer;
    font-size: 1.1rem;
    min-height: 36px;
    min-width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-items { font-size: 0.85rem; color: #8a7d6e; margin: 0; padding: 0.25rem 0; }

  .edit-order-btn {
    margin-top: 0.25rem;
    padding: 0.6rem 1rem;
    background: #1c1a17;
    color: #e8623a;
    border: 1px solid rgba(232, 98, 58, 0.35);
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
    width: 100%;
  }

  /* ─── Add person ─────────────────────────────────── */
  .add-person-section form {
    display: flex;
    gap: 0.5rem;
  }

  .person-input-wrap {
    flex: 1;
    position: relative;
  }

  .person-input-wrap input {
    width: 100%;
    padding: 0.7rem 0.8rem;
    background: #2a2520;
    border: 1px solid #3d3630;
    border-radius: 10px;
    color: #f5f0e8;
    font-size: 1rem;
    min-height: 48px;
    outline: none;
  }

  .person-input-wrap input:focus { border-color: #e8623a; }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #2a2520;
    border: 1px solid #3d3630;
    border-radius: 10px;
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    z-index: 50;
    overflow: hidden;
  }

  .dropdown li button {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    color: #f5f0e8;
    font-size: 0.95rem;
    cursor: pointer;
    min-height: 44px;
  }

  .dropdown li button:active { background: #3d3630; }

  .add-person-btn {
    padding: 0.7rem 1.1rem;
    background: #e8623a;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 48px;
    white-space: nowrap;
  }

  .add-person-btn:disabled { opacity: 0.4; cursor: default; }

  /* ─── Full-screen order form ─────────────────────── */
  .fullscreen-order {
    position: fixed;
    inset: 0;
    background: #1c1a17;
    z-index: 300;
    display: flex;
    flex-direction: column;
    font-family: system-ui, sans-serif;
  }

  .fullscreen-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: #13120f;
    border-bottom: 2px solid #e8623a;
    flex-shrink: 0;
  }

  .done-btn {
    background: none;
    border: none;
    color: #e8623a;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 44px;
    padding: 0 0.25rem;
    white-space: nowrap;
  }

  .fullscreen-name {
    flex: 1;
    font-size: 1.2rem;
    font-weight: 700;
    color: #f5f0e8;
    text-align: center;
  }

  .fs-total-bar {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.75rem 1rem;
    background: rgba(232, 98, 58, 0.1);
    border-bottom: 1px solid rgba(232, 98, 58, 0.2);
    flex-shrink: 0;
  }

  .fs-total-number {
    font-size: 2.4rem;
    font-weight: 800;
    color: #e8623a;
    line-height: 1;
  }

  .fs-total-label {
    font-size: 1rem;
    color: #8a7d6e;
    font-weight: 500;
  }

  .fullscreen-items {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .fs-row {
    padding: 1rem;
    border-bottom: 1px solid #2a2520;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .fs-item-info {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    justify-content: center;
  }

  .fs-item-name {
    font-size: 1.05rem;
    font-weight: 600;
    color: #f5f0e8;
  }

  .fs-item-price {
    font-size: 0.85rem;
    color: #8a7d6e;
  }

  .fs-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .qty-btn {
    flex: 1;
    padding: 0.7rem 0.5rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    min-height: 52px;
    border: none;
    transition: opacity 0.1s;
  }

  .qty-btn.minus {
    background: #2a2520;
    color: #f5f0e8;
    border: 1px solid #3d3630;
  }

  .qty-btn.minus:active { background: #3d3630; }

  .qty-btn.minus:disabled {
    opacity: 0.25;
    cursor: default;
  }

  .qty-btn.plus {
    background: rgba(232, 98, 58, 0.15);
    color: #e8623a;
    border: 1px solid rgba(232, 98, 58, 0.4);
  }

  .qty-btn.plus:active {
    background: #e8623a;
    color: #fff;
  }

  .qty-display {
    min-width: 3.5rem;
    text-align: center;
    font-size: 1.8rem;
    font-weight: 800;
    color: #f5f0e8;
    flex-shrink: 0;
  }

  .qty-zero {
    color: #3d3630;
  }

  .fullscreen-empty {
    padding: 3rem 1rem;
    text-align: center;
    color: #8a7d6e;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .fullscreen-empty a { color: #e8623a; }

  /* ─── Waiter view ────────────────────────────────── */
  .waiter-overlay {
    position: fixed;
    inset: 0;
    background: #13120f;
    z-index: 200;
    display: flex;
    flex-direction: column;
    font-family: system-ui, sans-serif;
    color: #f5f0e8;
  }

  .waiter-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #2a2520;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .waiter-title {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .waiter-title strong { font-size: 1.2rem; }
  .waiter-title span { font-size: 0.9rem; color: #8a7d6e; }

  .waiter-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .mode-toggle {
    display: flex;
    border: 1px solid #3d3630;
    border-radius: 8px;
    overflow: hidden;
  }

  .mode-toggle button {
    padding: 0.45rem 0.75rem;
    background: none;
    border: none;
    color: #8a7d6e;
    font-size: 0.85rem;
    cursor: pointer;
    min-height: 40px;
    font-weight: 500;
  }

  .mode-toggle button.active {
    background: #e8623a;
    color: #fff;
  }

  .close-btn {
    background: none;
    border: 1px solid #3d3630;
    color: #8a7d6e;
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    min-height: 40px;
  }

  .waiter-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1rem;
    -webkit-overflow-scrolling: touch;
  }

  /* Combined mode */
  .combined-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .combined-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 0;
    border-bottom: 1px solid #2a2520;
    gap: 1rem;
  }

  .combined-item:last-child { border-bottom: none; }

  .combined-name { font-size: 1.1rem; }

  .combined-qty {
    font-size: 1.3rem;
    font-weight: 800;
    color: #e8623a;
    flex-shrink: 0;
  }

  .combined-total {
    margin: 1.25rem 0 0;
    font-size: 1rem;
    color: #8a7d6e;
    text-align: right;
    font-weight: 600;
  }

  /* Individual mode */
  .waiter-body > .waiter-person { margin-bottom: 1.25rem; }

  .waiter-person { display: flex; flex-direction: column; gap: 0.4rem; }

  .waiter-person-name {
    font-size: 1.1rem;
    border-bottom: 1px solid #2a2520;
    padding-bottom: 0.3rem;
  }

  .waiter-items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .waiter-items li {
    font-size: 1rem;
    color: #c8bfb0;
    padding-left: 0.75rem;
  }

  .waiter-empty {
    color: #8a7d6e;
    text-align: center;
    padding: 2rem;
  }
</style>
