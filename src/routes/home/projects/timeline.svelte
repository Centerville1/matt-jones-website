<script>
  import Highlighted from './highlighted.svelte';
  import Card from './card.svelte';
  import { onMount } from 'svelte';

  export let experiences;

  /**
   * @type {HTMLDivElement | null}
   */
  let timelineElement = null;

  // Constants for positioning
  const CARD_VERTICAL_SPACING = 70; // Gap between cards (px)
  const CONNECTOR_TOP = 100; // Position of connector line from top of card (px)

  /**
   * Parse end date string to Date object
   * @param {string | null} dateStr - Date string in MM/DD/YYYY format or null for "Present"
   * @returns {Date}
   */
  const getEndDate = (dateStr) => {
    if (!dateStr || dateStr === null) {
      // "Present" - treat as most recent (today's date)
      return new Date();
    }
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  /**
   * Sort experiences by end date (most recent first), falling back to displayOrder
   * @type {PortfolioItem[]}
   */
  let experienceList = experiences.experiences.slice().sort(
    /**
     * @param {PortfolioItem} a
     * @param {PortfolioItem} b
     */
    (a, b) => {
      const dateA = getEndDate(a.endDate);
      const dateB = getEndDate(b.endDate);

      // Sort by end date descending (most recent first)
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }

      // If dates are equal, fall back to displayOrder
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    },
  );

  /**
   * Adjust card positions so they overlap up to the previous card's connector line
   */
  function adjustCardPositions() {
    if (!timelineElement) return;

    const items = /** @type {NodeListOf<HTMLElement>} */ (
      timelineElement.querySelectorAll('.timeline-item')
    );

    items.forEach((item, i) => {
      if (i === 0) {
        // First item has no overlap
        item.style.marginTop = '0';
        return;
      }

      const prevItem = items[i - 1];
      const isRightColumn = i % 2 === 1;

      if (isRightColumn) {
        // Right column cards: position so connector line is CARD_VERTICAL_SPACING below previous left card's bottom
        const prevCardElement = prevItem.querySelector('.card');
        if (!prevCardElement) return;

        const prevItemTop = prevItem.offsetTop;
        const prevCardHeight = prevCardElement.clientHeight;

        // Where we want the connector line to be (previous card bottom + spacing)
        const desiredConnectorPosition =
          prevItemTop + prevCardHeight + CARD_VERTICAL_SPACING;

        // Where this card needs to start (connector position - connector offset from card top)
        const desiredCardTop = desiredConnectorPosition - CONNECTOR_TOP;

        // Calculate margin-top needed
        const currentTop = prevItem.offsetTop + prevCardHeight;
        const pullUp = currentTop - desiredCardTop;

        item.style.marginTop = `-${pullUp}px`;
      } else {
        // Left column cards: position CARD_VERTICAL_SPACING below the previous (right column) card's connector line
        const prevCardElement = prevItem.querySelector('.card');
        if (!prevCardElement) return;

        const prevItemTop = prevItem.offsetTop;
        const prevCardHeight = prevCardElement.clientHeight;

        // Position where the connector line is for the previous (right) card
        const connectorAbsolutePosition = prevItemTop + CONNECTOR_TOP;

        // Where we want this card to start (connector + gap)
        const desiredTop = connectorAbsolutePosition + CARD_VERTICAL_SPACING;

        // Calculate what margin-top we need to achieve this
        const currentTop = prevItem.offsetTop + prevCardHeight;
        const pullUp = currentTop - desiredTop;

        item.style.marginTop = `-${pullUp}px`;
      }
    });
  }

  onMount(() => {
    adjustCardPositions();
  });
</script>

<Highlighted {experiences} />
<div class="upper-container">
  <h1>All Experience</h1>
</div>
<div class="timeline" bind:this={timelineElement}>
  {#each experienceList as experience, i}
    <div class="timeline-item" class:right={i % 2 === 1}>
      <div class="timeline-connector"></div>
      <div class="card-container">
        <Card
          title={experience.title}
          image={experience.image || ''}
          description={experience.description || ''}
          linkUrl={experience.url || ''}
          started={experience.startDate || ''}
          ended={experience.endDate || ''}
          minimizeHeight={true}
        ></Card>
      </div>
    </div>
  {/each}
</div>

<style>
  * {
    box-sizing: border-box;
    --timeline-color: var(--main-blue-light);
    --card-max-width: 350px;
    --timeline-left-offset: 30px;
    --connector-length: 40px;
  }

  .upper-container {
    padding-left: 20px;
    margin-bottom: 20px;
  }

  /* Timeline container with vertical line on the left */
  .timeline {
    position: relative;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: var(--timeline-left-offset);
    margin-left: 0;
    border-top: 6px solid var(--timeline-color);
    border-bottom: 6px solid var(--timeline-color);
    margin-bottom: 15px;
  }

  /* Vertical timeline line on the left */
  .timeline::after {
    content: '';
    position: absolute;
    width: 4px;
    background-color: var(--timeline-color);
    top: 0;
    bottom: 0;
    left: var(--timeline-left-offset);
  }

  /* Timeline item wrapper */
  .timeline-item {
    position: relative;
    width: 100%;
    margin-bottom: 0;
  }

  /* Left column cards */
  .timeline-item:not(.right) {
    padding-left: calc(var(--connector-length) + 10px);
  }

  /* Right column cards - offset to the right */
  .timeline-item.right {
    padding-left: calc(var(--connector-length) + var(--card-max-width) + 60px);
  }

  /* Horizontal connector line from timeline to card */
  .timeline-connector {
    position: absolute;
    height: 3px;
    background-color: var(--timeline-color);
    top: 100px; /* Align with middle of card image */
    left: calc(
      var(--timeline-left-offset) - 34px
    ); /* Start at the center of vertical timeline (4px wide) */
    width: calc(var(--connector-length) + 34px);
  }

  /* Right column connectors need to be longer */
  .timeline-item.right .timeline-connector {
    width: calc(var(--connector-length) + var(--card-max-width) + 70px);
  }

  /* Add a dot at the connection point on the timeline */
  .timeline-connector::before {
    content: '';
    position: absolute;
    left: -1px; /* Position at the start of the connector line */
    top: -4.5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--timeline-color);
    border: 2px solid var(--neutral-dark-gray);
  }

  /* Card container with max-width */
  .card-container {
    max-width: var(--card-max-width);
    width: 100%;
  }

  /* Mobile: Single column layout */
  @media (max-width: 740px) {
    /* Reset all cards to left column */
    .timeline-item {
      padding-left: calc(var(--connector-length) + 10px) !important;
    }

    /* Reset connector lengths for mobile */
    .timeline-connector,
    .timeline-item.right .timeline-connector {
      width: calc(var(--connector-length) + 34px) !important;
    }

    /* Increase card max-width to use more space on mobile */
    .card-container {
      max-width: 100%;
    }

    /* Reset any JavaScript-applied margin-top on mobile */
    .timeline-item {
      margin-top: 0 !important;
    }

    /* Add spacing between cards on mobile */
    .timeline-item:not(:last-child) {
      margin-bottom: 20px;
    }
  }
</style>
