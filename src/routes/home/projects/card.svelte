<script>
  import { goto } from '$app/navigation';

  export let title = 'Placeholder';
  export let description = 'Placeholder';
  /**
   * @type {String | null}
   */
  export let started = '';
  /**
   * @type {String | null}
   */
  export let ended = '';
  export let linkUrl = '';
  export let image = '';
  export const minimizeHeight = false;

  /**
   * @type {Date | null}
   */
  let startDate = null;

  /**
   * @type {string}
   */
  let startMonth;

  if (started !== '' && started !== null) {
    let mon1 = parseInt(started.substring(0, 2));
    let dt1 = parseInt(started.substring(3, 5));
    let yr1 = parseInt(started.substring(6, 10));
    startDate = new Date(yr1, mon1 - 1, dt1);
    startMonth = startDate.toLocaleString('default', { month: 'long' });
  }

  /**
   * @type {Date | null}
   */
  let endDate;

  /**
   * @type {string}
   */
  let endMonth;

  if (ended !== '' && ended !== null) {
    let mon1 = parseInt(ended.substring(0, 2));
    let dt1 = parseInt(ended.substring(3, 5));
    let yr1 = parseInt(ended.substring(6, 10));
    endDate = new Date(yr1, mon1 - 1, dt1);
    endMonth = endDate.toLocaleString('default', { month: 'long' });
  } else {
    // @ts-ignore
    endDate = 'Present';
  }

  /**
   * Handle card click - navigate to URL
   */
  function handleCardClick() {
    if (linkUrl !== '') {
      if (linkUrl.startsWith('https://')) {
        // @ts-ignore
        window.location = linkUrl;
      } else {
        goto(linkUrl);
      }
    }
  }
</script>

<div class="outer-boundary">
  <div class="card-wrapper">
    {#if linkUrl !== ''}
      <button
        class="card clickable"
        on:click={handleCardClick}
      >
        <!-- Header Image -->
        {#if image !== ''}
          <div class="card-image">
            <img src={image} alt="Image uploaded to represent {title}" />
          </div>
        {/if}

        <!-- Card Content -->
        <div class="card-content">
          <!-- Title -->
          <h2>{title}</h2>
          <a
            href={linkUrl}
            class="visit-link"
            target={linkUrl.startsWith('https://') ? '_blank' : undefined}
            rel={linkUrl.startsWith('https://')
              ? 'noopener noreferrer'
              : undefined}
            on:click={(e) => e.stopPropagation()}
          >
            <svg
              class="link-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              ></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Visit
          </a>

          <!-- Date Range -->
          {#if startDate !== null}
            <h5 class="date-range">
              {#if typeof endDate !== typeof '' && endDate !== null}
                {startMonth}
                {startDate.getFullYear()} - {endMonth}
                {endDate.getFullYear()}
              {:else}
                {startMonth}
                {startDate.getFullYear()} - {endDate}
              {/if}
            </h5>
          {/if}

          <!-- Description (expands on hover) -->
          <p class="description">
            {description}
          </p>
        </div>
      </button>
    {:else}
      <div class="card" role="article">
        <!-- Header Image -->
        {#if image !== ''}
          <div class="card-image">
            <img src={image} alt="Image uploaded to represent {title}" />
          </div>
        {/if}

        <!-- Card Content -->
        <div class="card-content">
          <!-- Title -->
          <h2>{title}</h2>

          <!-- Date Range -->
          {#if startDate !== null}
            <h5 class="date-range">
              {#if typeof endDate !== typeof '' && endDate !== null}
                {startMonth}
                {startDate.getFullYear()} - {endMonth}
                {endDate.getFullYear()}
              {:else}
                {startMonth}
                {startDate.getFullYear()} - {endDate}
              {/if}
            </h5>
          {/if}

          <!-- Description (expands on hover) -->
          <p class="description">
            {description}
          </p>
        </div>
      </div>
    {/if}
    <div class="accent-bar"></div>
  </div>
</div>

<style>
  .outer-boundary {
    padding-left: 2%;
    padding-right: 2%;
  }

  .card-wrapper {
    position: relative;
  }

  .card {
    border-radius: 16px 16px 0 0;
    background-color: var(--neutral-white);
    color: var(--contrast-text-light);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition:
      transform 0.2s ease-out,
      box-shadow 0.2s ease-out,
      max-height 0.3s ease-out;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    margin-bottom: 15px;
    max-height: 525px; /* Fixed height when collapsed */
    border-bottom: 1px solid var(--main-blue-light);
    /* Reset button styles */
    border: none;
    border-bottom: 1px solid var(--main-blue-light);
    padding: 0;
    font: inherit;
    text-align: left;
    width: 100%;
  }

  .card.clickable {
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--neutral-gray-op-50);
    max-height: 5000px; /* Expand on hover */
    z-index: 10; /* Bring to front when hovering */
  }

  .card-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background-color: var(--neutral-gray);
    flex-shrink: 0;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-out;
  }

  .card:hover .card-image img {
    transform: scale(1.05);
  }

  .card-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    overflow: hidden;
  }

  .card-content h2 {
    margin: 0 0 8px 0;
    font-size: 1.5rem;
    transition: color 0.2s;
  }

  .card.clickable:hover h2 {
    color: var(--main-blue);
  }

  .card.clickable:focus-visible {
    outline: 2px solid var(--main-blue);
    outline-offset: 2px;
    border-radius: 16px;
  }

  .visit-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.875rem;
    color: var(--main-blue);
    text-decoration: none;
    margin-bottom: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  .visit-link:hover {
    background-color: var(--main-blue-light);
    color: var(--neutral-white);
  }

  .link-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .date-range {
    margin: 0 0 12px 0;
    color: var(--neutral-light-gray);
    font-weight: 400;
    font-size: 0.9rem;
  }

  .description {
    text-align: left;
    margin: 0;
    line-height: 1.6;
    overflow: hidden;
    max-height: 180px; /* Approximate height for 6 lines */
    transition: max-height 0.4s ease-out;
    position: relative;
    white-space: pre-line; /* Preserve newlines from database */
    /* Gradient fade-out at bottom to indicate more text */
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  }

  .card:hover .description {
    max-height: 1000px;
    overflow-y: auto;
    /* Remove gradient on hover */
    mask-image: none;
    -webkit-mask-image: none;
  }
</style>
