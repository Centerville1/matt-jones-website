<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').PageData} */
  export let data;

  let activeTab = 'restaurants';
  let expandedRestaurantId = /** @type {number|null} */ (null);
  let addingMenuItemToId = /** @type {number|null} */ (null);
  let editingMenuItemId = /** @type {number|null} */ (null);
  let restaurantAdded = false;
  let personAdded = false;

  $: restaurants = data.restaurants;
  $: people = data.people;

  const refresh = () => async ({ update }) => update({ reset: false });

  function toggleRestaurant(id) {
    expandedRestaurantId = expandedRestaurantId === id ? null : id;
    if (expandedRestaurantId !== id) addingMenuItemToId = null;
  }

  function addRestaurantEnhance() {
    return async ({ result, update }) => {
      await update();
      if (result.type === 'success') {
        restaurantAdded = true;
        setTimeout(() => (restaurantAdded = false), 2500);
      }
    };
  }

  function addPersonEnhance() {
    return async ({ result, update }) => {
      await update();
      if (result.type === 'success') {
        personAdded = true;
        setTimeout(() => (personAdded = false), 2500);
      }
    };
  }
</script>

<svelte:head>
  <title>Wing Night — Manage</title>
</svelte:head>

<div class="app">
  <header>
    <span class="logo">🍗</span>
    <span class="title">Wing Night</span>
    <a href="/wings/logout" class="logout">Out</a>
  </header>

  <nav>
    <a href="/wings/order">Order</a>
    <a href="/wings/history">History</a>
    <a href="/wings/manage" class="active">Manage</a>
  </nav>

  <div class="tabs">
    <button
      type="button"
      class:active={activeTab === 'restaurants'}
      on:click={() => (activeTab = 'restaurants')}
    >
      Restaurants
    </button>
    <button
      type="button"
      class:active={activeTab === 'people'}
      on:click={() => (activeTab = 'people')}
    >
      People
    </button>
  </div>

  <main>
    <!-- ─── Restaurants tab ─────────────────────────── -->
    {#if activeTab === 'restaurants'}
      {#each restaurants as restaurant (restaurant.id)}
        <div class="card">
          <button
            type="button"
            class="card-header"
            on:click={() => toggleRestaurant(restaurant.id)}
          >
            <span class="card-title">{restaurant.name}</span>
            <span class="card-meta">{restaurant.menuItems.length} items</span>
            <span class="chevron" class:open={expandedRestaurantId === restaurant.id}>›</span>
          </button>

          {#if expandedRestaurantId === restaurant.id}
            <div class="card-body">
              {#if restaurant.notes}
                <p class="notes">{restaurant.notes}</p>
              {/if}

              <!-- Menu items -->
              {#each restaurant.menuItems as item (item.id)}
                {#if editingMenuItemId === item.id}
                  <form
                    method="POST"
                    action="?/updateMenuItem"
                    use:enhance={() => async ({ update }) => {
                      await update({ reset: false });
                      editingMenuItemId = null;
                    }}
                    class="edit-item-form"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <input type="text" name="name" value={item.name} required autofocus />
                    <input
                      type="text"
                      name="price"
                      value={item.priceInCents ? (item.priceInCents / 100).toFixed(2) : ''}
                      placeholder="Price (optional)"
                    />
                    <div class="form-row">
                      <button type="submit" class="btn-primary">Save</button>
                      <button type="button" class="btn-cancel" on:click={() => (editingMenuItemId = null)}>Cancel</button>
                    </div>
                  </form>
                {:else}
                  <div class="item-row">
                    <span class="item-name">{item.name}</span>
                    {#if item.priceInCents}
                      <span class="item-price">${(item.priceInCents / 100).toFixed(2)}</span>
                    {/if}
                    <button
                      type="button"
                      class="edit-btn"
                      aria-label="Edit {item.name}"
                      on:click={() => (editingMenuItemId = item.id)}
                    >✎</button>
                    <form method="POST" action="?/deleteMenuItem" use:enhance={refresh}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" class="delete-btn" aria-label="Delete {item.name}">×</button>
                    </form>
                  </div>
                {/if}
              {/each}

              <!-- Add menu item -->
              {#if addingMenuItemToId === restaurant.id}
                <form
                  method="POST"
                  action="?/addMenuItem"
                  use:enhance={() => async ({ update }) => {
                    await update();
                    addingMenuItemToId = null;
                  }}
                  class="add-form"
                >
                  <input type="hidden" name="restaurantId" value={restaurant.id} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Item name (e.g. Buffalo Traditional)"
                    required
                    autofocus
                  />
                  <input type="text" name="price" placeholder="Price (optional, e.g. 14.99)" />
                  <div class="form-row">
                    <button type="submit" class="btn-primary">Add Item</button>
                    <button
                      type="button"
                      class="btn-cancel"
                      on:click={() => (addingMenuItemToId = null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              {:else}
                <button
                  type="button"
                  class="add-item-btn"
                  on:click={() => (addingMenuItemToId = restaurant.id)}
                >
                  + Add Menu Item
                </button>
              {/if}

              <!-- Delete restaurant -->
              <form method="POST" action="?/deleteRestaurant" use:enhance={refresh} class="delete-restaurant-form">
                <input type="hidden" name="id" value={restaurant.id} />
                <button
                  type="submit"
                  class="delete-restaurant-btn"
                  on:click|preventDefault={(e) => {
                    if (confirm(`Delete "${restaurant.name}" and ALL its sessions, orders, and menu items? This cannot be undone.`)) e.currentTarget.form.submit();
                  }}
                >
                  Delete Restaurant
                </button>
              </form>
            </div>
          {/if}
        </div>
      {/each}

      <!-- Add restaurant form -->
      <div class="add-section">
        <h3 class="add-title">Add Restaurant</h3>
        {#if restaurantAdded}
          <p class="success-msg">Restaurant added!</p>
        {/if}
        <form method="POST" action="?/addRestaurant" use:enhance={addRestaurantEnhance} class="add-form">
          <input type="text" name="name" placeholder="Restaurant name" required />
          <input type="text" name="notes" placeholder="Notes (optional)" />
          <button type="submit" class="btn-primary">Add Restaurant</button>
        </form>
      </div>
    {/if}

    <!-- ─── People tab ──────────────────────────────── -->
    {#if activeTab === 'people'}
      <div class="card">
        {#each people as person (person.id)}
          <div class="item-row">
            <span class="item-name">{person.name}</span>
            <form method="POST" action="?/deletePerson" use:enhance={refresh}>
              <input type="hidden" name="id" value={person.id} />
              <button
                type="submit"
                class="delete-btn"
                on:click|preventDefault={(e) => {
                  if (confirm(`Remove "${person.name}" and ALL their order history? This cannot be undone.`)) e.currentTarget.form.submit();
                }}
                aria-label="Delete {person.name}"
              >
                ×
              </button>
            </form>
          </div>
        {/each}

        {#if people.length === 0}
          <p class="empty-list">No people yet. They're added automatically when you add them to an order.</p>
        {/if}
      </div>

      <div class="add-section">
        <h3 class="add-title">Add Person</h3>
        {#if personAdded}
          <p class="success-msg">Person added!</p>
        {/if}
        <form method="POST" action="?/addPerson" use:enhance={addPersonEnhance} class="add-form">
          <input type="text" name="name" placeholder="Name" required />
          <button type="submit" class="btn-primary">Add Person</button>
        </form>
      </div>
    {/if}
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

  /* ─── Tabs ───────────────────────────────────────── */
  .tabs {
    display: flex;
    padding: 0.75rem 1rem;
    gap: 0.5rem;
    border-bottom: 1px solid #2a2520;
  }

  .tabs button {
    padding: 0.5rem 1rem;
    background: #2a2520;
    border: 1px solid #3d3630;
    border-radius: 8px;
    color: #8a7d6e;
    font-size: 0.9rem;
    cursor: pointer;
    min-height: 44px;
    font-weight: 500;
  }

  .tabs button.active {
    background: rgba(232, 98, 58, 0.15);
    border-color: #e8623a;
    color: #e8623a;
  }

  /* ─── Main ───────────────────────────────────────── */
  main {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* ─── Card ───────────────────────────────────────── */
  .card {
    background: #2a2520;
    border-radius: 14px;
    overflow: hidden;
  }

  .card-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1rem;
    background: none;
    border: none;
    color: #f5f0e8;
    text-align: left;
    cursor: pointer;
    min-height: 56px;
  }

  .card-title {
    flex: 1;
    font-size: 1rem;
    font-weight: 600;
  }

  .card-meta {
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

  .card-body {
    padding: 0 1rem 1rem;
    border-top: 1px solid #3d3630;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.75rem;
  }

  .notes {
    font-size: 0.85rem;
    color: #8a7d6e;
    margin: 0 0 0.25rem;
  }

  /* ─── Item row ───────────────────────────────────── */
  .item-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-bottom: 1px solid #3d3630;
  }

  .item-row:last-of-type {
    border-bottom: none;
  }

  .item-name {
    flex: 1;
    font-size: 0.95rem;
  }

  .item-price {
    font-size: 0.85rem;
    color: #8a7d6e;
  }

  .delete-btn {
    background: none;
    border: none;
    color: #8a7d6e;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.2rem;
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .delete-btn:active {
    color: #ff6b4a;
  }

  .edit-btn {
    background: none;
    border: none;
    color: #8a7d6e;
    font-size: 1rem;
    cursor: pointer;
    min-height: 44px;
    min-width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .edit-btn:active { color: #e8623a; }

  .edit-item-form {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #3d3630;
    background: rgba(232, 98, 58, 0.05);
  }

  .edit-item-form input {
    padding: 0.55rem 0.7rem;
    background: #1c1a17;
    border: 1px solid #3d3630;
    border-radius: 8px;
    color: #f5f0e8;
    font-size: 0.95rem;
    min-height: 44px;
    outline: none;
  }

  .edit-item-form input:focus { border-color: #e8623a; }

  /* ─── Add forms ──────────────────────────────────── */
  .add-section {
    background: #2a2520;
    border-radius: 14px;
    padding: 1rem;
  }

  .add-title {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    color: #8a7d6e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  .add-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .add-form input {
    padding: 0.7rem 0.8rem;
    background: #1c1a17;
    border: 1px solid #3d3630;
    border-radius: 8px;
    color: #f5f0e8;
    font-size: 1rem;
    min-height: 48px;
    outline: none;
  }

  .add-form input:focus {
    border-color: #e8623a;
  }

  .btn-primary {
    padding: 0.75rem;
    background: #e8623a;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    min-height: 48px;
  }

  .btn-primary:active {
    background: #c94e28;
  }

  .btn-cancel {
    padding: 0.75rem;
    background: none;
    color: #8a7d6e;
    border: 1px solid #3d3630;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    min-height: 48px;
  }

  .form-row {
    display: flex;
    gap: 0.5rem;
  }

  .form-row .btn-primary,
  .form-row .btn-cancel {
    flex: 1;
  }

  .add-item-btn {
    width: 100%;
    padding: 0.65rem;
    background: none;
    border: 1px dashed #3d3630;
    color: #8a7d6e;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    min-height: 44px;
    margin-top: 0.25rem;
  }

  .add-item-btn:hover {
    border-color: #e8623a;
    color: #e8623a;
  }

  .delete-restaurant-form {
    margin-top: 0.5rem;
  }

  .delete-restaurant-btn {
    width: 100%;
    padding: 0.65rem;
    background: none;
    border: 1px solid rgba(255, 107, 74, 0.3);
    color: #8a7d6e;
    border-radius: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    min-height: 44px;
  }

  .delete-restaurant-btn:active {
    border-color: #ff6b4a;
    color: #ff6b4a;
  }

  .success-msg {
    padding: 0.9rem 1rem;
    background: rgba(80, 180, 100, 0.15);
    border: 1px solid rgba(80, 180, 100, 0.3);
    border-radius: 10px;
    color: #6dcc88;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
    margin: 0;
  }

  .empty-list {
    padding: 1.25rem 1rem;
    color: #8a7d6e;
    font-size: 0.9rem;
    margin: 0;
  }
</style>
