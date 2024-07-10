<script>
  export let title = "Default Title";
  export let subtitle = "";
  export let background = "blocks";
  export let signature = true;
</script>

<div class="page {background}">
  <div class="title">
    <h1>{title}</h1>
    {#if subtitle !== ""}
      <h3>{subtitle}</h3>
    {/if}
  </div>
  <div class="page-content">
    <slot />
  </div>
  {#if signature}
    <h2>Thanks,</h2>
    <img src="/MJ_Signature-nobg.png" width=250 alt="Matt Jones' signature" />
  {/if}
</div>

<style>
  .page {
    height: fit-content;
    min-height: 80vh;
    padding: 30px;
  }

  .zigzag {
    background: linear-gradient(135deg, var(--neutral-dark-gray-op-10) 25%, transparent 25%) -45px 0/ 90px 90px, 
    linear-gradient(225deg, var(--neutral-dark-gray-op-50) 25%, transparent 25%) -45px 0/ 90px 90px, 
    linear-gradient(315deg, var(--neutral-dark-gray-op-10) 25%, transparent 25%) 0px 0/ 90px 90px, 
    linear-gradient(45deg, var(--neutral-dark-gray-op-50) 25%, var(--no-background) 25%) 0px 0/ 90px 90px;
  }

  .blocks {
    background-image:  linear-gradient(30deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(150deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(30deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(150deg, var(--neutral-dark-gray-op-50) 12%, transparent 12.5%, transparent 87%, var(--neutral-dark-gray-op-50) 87.5%, var(--neutral-dark-gray-op-50)), 
    linear-gradient(60deg, var(--neutral-dark-gray-op-10) 25%, transparent 25.5%, transparent 75%, var(--neutral-dark-gray-op-10) 75%, var(--neutral-dark-gray-op-10)), 
    linear-gradient(60deg, var(--neutral-dark-gray-op-10) 25%, transparent 25.5%, transparent 75%, var(--neutral-dark-gray-op-10) 75%, var(--neutral-dark-gray-op-10));
    background-size: 80px 140px;
    background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  }

  .checker {
    background-image:  repeating-linear-gradient(45deg, var(--neutral-dark-gray-op-50) 25%, transparent 25%, transparent 75%, var(--neutral-dark-gray-op-50) 75%, var(--neutral-dark-gray-op-50)), 
    repeating-linear-gradient(45deg, var(--neutral-dark-gray-op-50) 25%, var(--neutral-dark-gray-op-10) 25%, var(--neutral-dark-gray-op-10) 75%, var(--neutral-dark-gray-op-50) 75%, var(--neutral-dark-gray-op-50));
    background-position: 0 0, 15px 15px;
    background-size: 30px 30px;
  }

  .crosses {
    background:
      radial-gradient(
        circle,
        transparent 20%,
        var(--neutral-gray) 20%,
        var(--neutral-gray) 80%,
        transparent 80%,
        transparent
      ),
      radial-gradient(
          circle,
          transparent 20%,
          var(--neutral-gray) 20%,
          var(--neutral-gray) 80%,
          transparent 80%,
          transparent
        )
        30px 30px,
      linear-gradient(var(--neutral-dark-gray-op-50) 2.6px, transparent 2.6px) 0 -1.3px,
      linear-gradient(
          90deg,
          var(--neutral-dark-gray-op-50) 2.6px,
          var(--neutral-gray) 2.6px
        ) -1.3px 0;
    background-size:
      60px 60px,
      60px 60px,
      30px 30px,
      30px 30px;
  }

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 20px;
  }

  .page-content :global(p) {
    text-indent: 30px;
  }

  .page-content :global(img) {
    display: block;
    width: 60%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .page-content :global(hr) {
    width: 80%;
  }

  .page-content :global(.spacing) {
    margin-top: 50px;
  }

  @media screen and (max-width: 440px) {
    .page-content :global(img) {
      width: 100%;
    }
  }
</style>