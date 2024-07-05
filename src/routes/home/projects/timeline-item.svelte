<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let title = 'Placeholder';
    export let description = 'Placeholder';
    export let started = '';
    export let ended = '';
    export let linkUrl = '';
    export let index = 0
    export let maxHeight = 370

    let showButtonShown = false;
    let overflowHidden = false;
    let renderHeight = 0;
    let boxPosition = 0;

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
     * @type {string | Date}
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
        endDate = 'Present';
    }

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
            content.style.height = "" + (maxHeight - 70) + "px";
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
            content.style.height = "" + (maxHeight - 70) + "px"
            main.scrollTo({top:boxPosition, behavior:'smooth'})
        }
    }

    function linkClicked() {
        if(linkUrl !== "") {
            console.log(linkUrl.slice(0,4))
            if (linkUrl.slice(0,4) === "http") {
                location.href=linkUrl
            }
            else {
                goto(linkUrl);
            }
        }
    }
</script>

<div id="container{index}" class="container right">
    <button class="outer-button" on:click={() => {linkClicked()}}>
        <div id="content{index}" class="content">
            <div id="hide-content{index}" class="hide-content">
                <h2>{title}</h2>
                {#if startDate !== null}
                    {#if endDate !== 'Present'}
                    <h5>
                        {startMonth}
                        {startDate.getFullYear()} - {endMonth}
                        {endDate.getFullYear()}
                    </h5>
                    {:else}
                    <h5>
                        {startMonth}
                        {startDate.getFullYear()} - {endDate}
                    </h5>
                    {/if}
                {/if}
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

<style>
    * {
        box-sizing: border-box;
        --box-color: var(--main-blue-alt)
    }

    /* Container around content */
    .container {
        background-color: var(--no-background);
        z-index: 1;
        position: relative;
        width: 90%;
        padding-left: 40px;
        padding-right: 25px;
        border-radius: 40px;
        margin-bottom: 10px;
    }

    /* The circles on the timeline */
    .container::after {
        content: '';
        position: absolute;
        width: 25px;
        height: 25px;
        right: -17px;
        background-color: var(--main-blue-light);
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

    /* Place the container to the right */
    .right {
        left: 31px;
    }

    /* Add arrows to the right container (pointing left) */
    .right::before {
        content: " ";
        left: 20px;
        height: 0;
        position: absolute;
        top: 22px;
        width: 0;
        z-index: 1;
        border: medium solid var(--box-color);
        border-width: 10px 20px 10px 0;
        border-color: transparent var(--box-color) transparent transparent;
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
        border: 3px solid var(--box-color);
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

    h5 {
        margin: 0;
    }

    p {
        margin: 0;
    }
</style>