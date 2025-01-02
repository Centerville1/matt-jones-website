<script>
  import { onMount } from "svelte";

  /**
   * @type {number}
   */
   export let height;
  /**
   * @type {number}
   */
   export let width;

   export let scale = 10;

  let play = true;

  function togglePlay() {
    play = play ? false : true;
  }

  let realHeight = Math.floor(height/scale);
  let realWidth = Math.floor(width/scale);


  /**
   * @type {number[][][]}
   */
  let simMatrix = []

  /**
  * @type {HTMLCanvasElement}
  */
  // @ts-ignore
  let canvas

  /**
  * @type {CanvasRenderingContext2D}
  */
  let canvasCtx;

  /**
   * @type {ImageData}
   */
  let imgData;



  const BACKGROUND = [51, 31, 14, 255];
  const YOUNGTREE = [0, 255, 0, 255];
  const OLDTREE = [0, 175, 0, 255];
  const HOUSECOLOR = [130, 100, 150, 255];
  const STONE = [100, 100, 100, 255];
  const WATER = [0, 0, 255, 255];
  const BURNTCOLOR = [80, 130, 130, 255];
  const FIRECOOL = [255, 126, 42, 255];
  const FIREMED = [220, 50, 0, 255];
  const FIREHOT = [200, 0, 0, 255];

  const TREECOLORS = [YOUNGTREE, OLDTREE];
  const FIRECOLORS = [FIRECOOL, FIREMED, FIREHOT];

  const TREECHANCE = 0.05;
  const TREESPROUT = 0.000000001;
  const NEARNEIGHBORSPROUT = 0.001;
  const TREEGROW = 0.01;
  const BURNREPAIR = 0.10;
  const HOUSECHANCE = 0;
  const SPONTANEOUSCOMBUSTION = 0.000004;
  const FIRESPREADCHANCE = 0.33;
  
  const MAXSTONES = 10;
  const MAXSTONESIZE = 6;
  const MAXLAKES = 2;
  const MAXLAKESIZE = 10;

  const BLOBSPREADPROB = 0.15;


  // Time between simulation steps in ms
  let simulationDelay = 50;

  /**
   * @param {number} maxsize
   * @param {number[]} color
   */
  function generateBlob(maxsize, color) {
    let x = Math.floor(Math.random() * realWidth);
    let y = Math.floor(Math.random() * realHeight);

    let delta = Math.floor(maxsize/2);

    for (let ix = x-delta; ix <= x+delta; ix++) {
      for (let iy = y-delta; iy <= y+delta; iy++) {
        if (iy > 0 && iy < realHeight && ix > 0 && ix < realWidth) {
          if (Math.random() < (countNeighbors(ix, 2, iy, 2, [color])+1) * BLOBSPREADPROB) {
            simMatrix[iy][ix] = color;
          }
        }
      }
    }
  }


  function resetSim() {
    play = false;
    initSimulation();
    renderSim();
  }


  /**
   * @param {number} x x position to check neighbors
   * @param {number} dx horizontal distance away from x to ccount neighbors
   * @param {number} y y position to check neighbors
   * @param {number} dy vertical distance away from y to ccount neighbors
   * @param {number[][]} colors array of colors to count
   */
  function countNeighbors(x, dx, y, dy, colors) {
    let count = 0;
    for (let iy = y-dy; iy <= y+dy; iy++) {
      for (let ix = x-dx; ix <= x+dx; ix++) {
        if (iy > 0 && iy < realHeight && ix > 0 && ix < realWidth) {
          if (!(iy === y && ix === x)) {
            let color = simMatrix[iy][ix];
            for (let i = 0; i < colors.length; i++) {
              if (colors[i].toString() === color.toString()) {
                count++;
              }
            }
          }
        }
      }
    }
    return count;
  }


  /**
   * @param {number[][][]} matrix
   */
  function deepCopyGameMatrix(matrix) {
    /**
     * @type {number[][][]}
     */
    let returnedMatrix=[];
    for (let y=0; y<realHeight; y++) {
      let row = [];
      for (let x=0; x<realWidth; x++) {
        let item = []
        for (let i=0; i<4; i++) {
          item[i] = matrix[y][x][i];
        }
        row[x] = item;
      }
      returnedMatrix[y] = row;
    }
    return returnedMatrix;
  }


  function initSimulation() {
    // Initialize the global canvas data variables
    /**
    * @type {HTMLCanvasElement}
    */
    // @ts-ignore
    canvas = document.getElementById("fireSimCanvas");
    /**
    * @type {CanvasRenderingContext2D}
    */
    // @ts-ignore
    canvasCtx = canvas.getContext("2d");
    imgData = canvasCtx.createImageData(width, height);

    for (let y=0; y<realHeight; y++) {
      let row = [];
      for (let x=0; x<realWidth; x++) {
        if (Math.random() < HOUSECHANCE) {
          row[x] = HOUSECOLOR;
        }
        else if (Math.random() < TREECHANCE) {
          row[x] = OLDTREE;
        }
        else{
          row[x] = BACKGROUND;
        }
      }
      simMatrix[y] = row;
    }

    let numStones = Math.floor(Math.random() * MAXSTONES);
    for (let i = 0; i < numStones; i++) {
      generateBlob(MAXSTONESIZE, STONE);
    }
    let numLakes = Math.floor(Math.random() * MAXLAKES);
    for (let i = 0; i < numLakes; i++) {
      generateBlob(MAXLAKESIZE, WATER);
    }
  }



  function runSimulation() {
    if (play) {
      let modifiedMatrix = deepCopyGameMatrix(simMatrix);
      // let modifiedMatrix = simMatrix;
      for (let y=0; y<realHeight; y++) {
        for (let x=0; x<realWidth; x++) {
          let color = simMatrix[y][x].toString();

          if (color === BACKGROUND.toString()) {
            let aliveNeighbors = countNeighbors(x, 2, y, 2, TREECOLORS);
            if (Math.random() < TREESPROUT + (aliveNeighbors * NEARNEIGHBORSPROUT)) {
              modifiedMatrix[y][x] = YOUNGTREE;
            }
          }
          else if (color === OLDTREE.toString() || color === YOUNGTREE.toString()) {
            let burningNeighbors = countNeighbors(x, 1, y, 1, FIRECOLORS);

            if (Math.random() < burningNeighbors * FIRESPREADCHANCE) {
              if (color === YOUNGTREE.toString()){
                modifiedMatrix[y][x] = FIRECOOL;
              }
              else if (Math.random() < burningNeighbors * (FIRESPREADCHANCE/2)){
                modifiedMatrix[y][x] = FIRECOOL;
              }
            }
            else if (Math.random() < SPONTANEOUSCOMBUSTION) {
              modifiedMatrix[y][x] = FIRECOOL;
            }
            else if (color === YOUNGTREE.toString()) {
              if (Math.random() < TREEGROW) {
                modifiedMatrix[y][x] = OLDTREE;
            }
            }
          }
          else if (color === FIRECOOL.toString()) {
            modifiedMatrix[y][x] = FIREMED;
          }
          else if (color === FIREMED.toString()) {
            modifiedMatrix[y][x] = FIREHOT;
          }
          else if (color === FIREHOT.toString()) {
            modifiedMatrix[y][x] = BURNTCOLOR;
          }
          else if (color === BURNTCOLOR.toString()) {
            if (Math.random() < BURNREPAIR) {
              modifiedMatrix[y][x] = BACKGROUND;
            }
          }
        }
      }
      simMatrix = deepCopyGameMatrix(modifiedMatrix);
      renderSim();
    }
    setTimeout(runSimulation, simulationDelay);
  }



  function renderSim() {
    for (let i=0; i<imgData.data.length; i+=4) {
      // Calculate x, y positions in the 2D array using the column major order 
      // 1D imgData array iterator i
      let x = (i/4) % width;
      let y = Math.ceil(((i/4)+1) / (height*width) * height)-1;

      x = Math.floor(x/scale);
      y = Math.floor(y/scale);

      // console.log(x, y, realWidth, realHeight);

      if (x < realWidth && y < realHeight) {
        let r = simMatrix[y][x][0];
        let g = simMatrix[y][x][1];
        let b = simMatrix[y][x][2];
        let a = simMatrix[y][x][3];

        imgData.data[i+0] = r;
        imgData.data[i+1] = g;
        imgData.data[i+2] = b;
        imgData.data[i+3] = a;
      }
    }
    canvasCtx.putImageData(imgData, 0, 0);
  }

  onMount(() => {
    initSimulation();
    renderSim();
    runSimulation();
  })
</script>

<div>
  <button id="play" on:click = {togglePlay}>
    {#if play}
      Pause
    {:else}
      Play
    {/if}
  </button>
  <button id="play" on:click = {resetSim}>Restart</button>
  <canvas id="fireSimCanvas" width={width} height={height} />
</div>

<style>
  /* Container */
  div {
    width: 100%;
  }

  /* Center canvas, add border, and resize with screen */
  canvas {
    margin: 30px auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 90%;
    padding: 10px;
    border: solid 1px var(--contrast-text-light);
    border-radius: 20px;
  }
</style>
