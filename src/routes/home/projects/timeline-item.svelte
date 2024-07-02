<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let left = true;
    export let title = 'Placeholder';
    export let description = 'Placeholder';
    export let started = 'Placeholder';
    export let ended = 'Placeholder';
    export let linkUrl = '';
    export let index = 0

    let maxHeight = 300;
    let showButtonShown = false;
    let overflowHidden = false;
    let renderHeight = 0

    onMount(() => {
        let box = document.getElementById("content"+index)
        renderHeight = box?.offsetHeight;
        if (renderHeight > maxHeight) {
            showButtonShown = true
            changeOverflow()
        }
    })

    function changeOverflow() {
        let content = document.getElementById("hide-content"+index);
        if (overflowHidden) {
            overflowHidden = false;
            content.style.height = ""+renderHeight+"px"
        }
        else {
            overflowHidden = true;
            content.style.height = "300px"
        }
    }
</script>

{#if left}
    <div class="container left">
        <button on:click={() => {
            if (linkUrl !== '') {
            goto(linkUrl);
            }
        }}>
            <div id="content{index}" class="content">
                <div id="hide-content{index}" class="hide-content">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                {#if overflowHidden && showButtonShown}
                    <button on:click={() => {changeOverflow()}} class="show-more">
                        <a href="#">Show More</a>
                    </button>
                {:else if showButtonShown}
                <button on:click={() => {changeOverflow()}} class="show-more">
                    <a href="#">Show Less</a>
                </button>
                {/if}
    
            </div>
        </button>
    </div>
{:else}
<div id="container" class="container right">
    <button on:click={() => {
        if (linkUrl !== '') {
        goto(linkUrl);
        }
    }}>
        <div id="content{index}" class="content">
            <div id="hide-content{index}" class="hide-content">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {#if overflowHidden && showButtonShown}
                <button on:click={() => {changeOverflow()}} class="show-more">
                    <a href="#">Show More</a>
                </button>
            {:else if showButtonShown}
            <button on:click={() => {changeOverflow()}} class="show-more">
                <a href="#">Show Less</a>
            </button>
            {/if}

        </div>
    </button>
</div>
{/if}

<style>
    * {
        box-sizing: border-box;
        --box-background: var(--neutral-black)
    }

    /* Container around content */
    .container {
    padding: 10px 40px;
    color: var(--contrast-text-dark);
    opacity: 80%;
    z-index: 1;
    position: relative;
    background-color: inherit;
    width: 50%;
    transition: 1s;
    border-radius: 40px;
    }

    .container:hover {
    background-color: var(--main-blue-alt);
    opacity: 75%;
    }

    /* The circles on the timeline */
    .container::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    right: -17px;
    background-color: var(--box-background);
    opacity: 100%;
    border: 4px solid #FF9F55;
    top: 15px;
    border-radius: 50%;
    z-index: 1;
    }

    .container button {
    background-color: inherit;
    border: inherit;
    font-size: inherit;
    text-align: inherit;
    width: 100%;
    height: 100%;
    padding: 0px;
    }

    /* Place the container to the left */
    .left {
    left: 0;
    }

    /* Place the container to the right */
    .right {
    left: 50%;
    }

    /* Add arrows to the left container (pointing right) */
    .left::before {
    content: " ";
    height: 0;
    position: absolute;
    top: 22px;
    width: 0;
    z-index: 1;
    right: 30px;
    border: medium solid var(--box-background);
    border-width: 10px 0 10px 10px;
    border-color: transparent transparent transparent var(--box-background);
    }

    /* Add arrows to the right container (pointing left) */
    .right::before {
    content: " ";
    height: 0;
    position: absolute;
    top: 22px;
    width: 0;
    z-index: 1;
    left: 30px;
    border: medium solid var(--box-background);
    border-width: 10px 10px 10px 0;
    border-color: transparent var(--box-background) transparent transparent;
    }

    /* Fix the circle for containers on the right side */
    .right::after {
    left: -16px;
    }

    /* The actual content */
    .content {
    padding: 20px 30px;
    background-color: var(--box-background);
    position: relative;
    border-radius: 6px;
    white-space: pre;
    text-wrap: wrap;
    }

    .hide-content {
        transition: height 0.5s cubic-bezier(.38,.02,.38,1.02);
        overflow: hidden;
        -webkit-line-clamp: 6;
    }

    /* Media queries - Responsive timeline on screens less than 600px wide */
    @media screen and (max-width: 600px) {
        /* Full-width containers */
  .container {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
  }

/* Make sure that all arrows are pointing leftwards */
  .container::before {
    left: 60px;
    border: medium solid var(--box-background);
    border-width: 10px 10px 10px 0;
    border-color: transparent var(--box-background) transparent transparent;
  }

/* Make sure all circles are at the same spot */
  .left::after, .right::after {
    left: 15px;
  }

/* Make all right containers behave like the left ones */
  .right {
    left: 0%;
  }
    }
</style>