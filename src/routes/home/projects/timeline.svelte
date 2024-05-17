<script>
  
</script>

<div class="timeline-container">
  <div class="timeline white"><p>2024</p></div>
  <div class="square blue"></div>
  <div class="timeline white"><p>2023</p></div>
  <div class="square green"></div>
  <div class="square red"></div>
  <div class="timeline white"><p>2022</p></div>
  <div class="timeline white"><p>2021</p></div>
  <div class="timeline white"><p>2020</p></div>
  <div class="timeline white"><p>2019</p></div>

</div>


<style>
  .timeline-container {
    display: grid;
    width: 330px;
    margin-left: auto;
    margin-right: auto;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(100, 25px);
  }

  .timeline {
    grid-column: 5;
    grid-row: span 12;
    height: 99%;
    opacity: 70%;
    color: var(--contrast-text-dark);
  }

  .timeline p {
    margin-top: 3px;
    margin-left: 2px;
    font-family: 'Inter', sans-serif;
    font-size: smaller;
    font-weight: bold;
  }

  .white {
    background-color: var(--neutral-black);
  }

  .square {
    grid-column: span 1;
    grid-row: span 6;
    border-radius: 10px;
    height: 100%;
    transition: opacity 0.5s;
    opacity: 40%;
  }

  .square:hover {
    opacity: 60%;
  }

  .red {
    background-color: var(--red);
  }

  .green {
    background-color: var(--green);
  }

  .blue {
    background-color: var(--main-blue-light);
  }
</style>
