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

    let maxHeight = 370;
    let showButtonShown = false;
    let overflowHidden = false;
    let renderHeight = 0;
    let boxPosition = 0;

    onMount(() => {
        // Find position of the top of this timeline item
        // used for scrolling on minimize
        let container = document.getElementById("container"+index);
        boxPosition = container.offsetTop - 100;

        // detect if box is larger than a certain size, and activate
        // the "show more" button
        let box = document.getElementById("content"+index)
        renderHeight = box.offsetHeight;
        if (renderHeight > maxHeight) {
            showButtonShown = true
            overflowHidden = true;
            let content = document.getElementById("hide-content"+index);
            content.style.height = "300px"
        }
    })

    function changeOverflow() {
        let main = document.getElementsByTagName("main")[0];
        let content = document.getElementById("hide-content"+index);
        if (overflowHidden) {
            overflowHidden = false;
            content.style.height = ""+renderHeight+"px"
        }
        else {
            overflowHidden = true;
            content.style.height = "300px"
            main.scrollTo({top:boxPosition, behavior:'smooth'})
        }
    }
</script>

{#if left}
    <div id="container{index}" class="container left">
        <button class="outer-button" on:click={() => {
            if (linkUrl !== '') {
            goto(linkUrl);
            }
        }}>
            <div id="content{index}" class="content">
                <div id="hide-content{index}" class="hide-content">
                    <h2>{title}</h2>
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
<div id="container{index}" class="container right">
    <button class="outer-button" on:click={() => {
        if (linkUrl !== '') {
        goto(linkUrl);
        }
    }}>
        <div id="content{index}" class="content">
            <div id="hide-content{index}" class="hide-content">
                <h2>{title}</h2>
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
        --box-background: var(--neutral-dark-gray)
    }

    /* Container around content */
    .container {
        background-color: var(--no-background);
        padding: 10px 40px;
        z-index: 1;
        position: relative;
        width: 50%;
        border-radius: 40px;
    }

    /* The circles on the timeline */
    .container::after {
        content: '';
        position: absolute;
        width: 25px;
        height: 25px;
        right: -17px;
        background-color: var(--main-blue-light);
        opacity: 100%;
        border: 4px solid var(--contrast-text-light);
        top: 15px;
        border-radius: 50%;
        z-index: 1;
    }

    .container button {
        background: none;
        font-size: inherit;
        text-align: inherit;
        width: 100%;
        padding: 0px;
    }

    .outer-button {
        border: none;
        background-color: inherit;
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
        top: 24px;
        width: 0;
        z-index: 1;
        right: 21px;
        border: medium solid var(--box-background);
        border-width: 10px 0 10px 20px;
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
        left: 21px;
        border: medium solid var(--box-background);
        border-width: 10px 20px 10px 0;
        border-color: transparent var(--box-background) transparent transparent;
    }

    /* Fix the circle for containers on the right side */
    .right::after {
    left: -16px;
    }

    /* The actual content */
    .content {
        padding: 10px 10px;
        background-color: var(--no-background);
        color: var(--contrast-text-light);
        position: relative;
        border-radius: 6px;
        white-space: pre;
        text-wrap: wrap;
        border-radius: 20px;
        border: 3px solid var(--neutral-dark-gray);
        transition: background 0.5s cubic-bezier(.72,0,.83,.67);
    }

    .container:hover .content {
        background-color: var(--main-blue-alt);
        transition: background 0.3s cubic-bezier(.03,.38,.72,.71);
    }

    a {
        color: var(--contrast-text-light);
    }

    .hide-content {
        transition: height 1s cubic-bezier(.38,.02,.38,1.02);
        overflow: hidden;
        -webkit-line-clamp: 6;
    }

    h2 {
        margin-bottom: 0;
    }

    p {
        margin-top: 0;
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