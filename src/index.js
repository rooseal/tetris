import { width, height, keyBindings, calculateGravityTimer, getContext, getPoints } from './variables';
import { drawBackground, drawShape, drawGameOver, drawStaple, drawSquare } from './draw';
import { getRandomShape } from './Block';

// Top level access to canvas and context
let canvas;
let context;

let nextBlockCanvas;
let nextBlockContext;

// Grab all the relevant UI displays
const ui = {
  level: document.getElementById('level'),
  dal: {
    value: document.getElementById('dalValue'),
    bar: document.getElementById('dalValueBar'),
  },
  gravity: {
    current: document.getElementById('currentDown'),
    max: document.getElementById('maxDown'),
  },
  stats: {
    o: document.getElementById('o'),
    i: document.getElementById('i'),
    l: document.getElementById('l'),
    j: document.getElementById('j'),
    s: document.getElementById('s'),
    z: document.getElementById('z'),
    t: document.getElementById('t'),
  },
  frameRate: document.getElementById('frameRate'),
  score: {
    top: document.getElementById('topScore'),
    current: document.getElementById('score'),
  },
  gameOver: {
    screen: document.getElementById('gameOver'),
    restart: document.getElementById('restart'),
  },
};

//
// Game State
//

// The timestamp of the last time the game did update
let secondsPassed;
let oldTimeStamp;
let fps;

let gravityTimer = 0;
let dalValue = 0;
let increaseDal = false;

let topScore = 0;
let score = 0;
let linesCleared = 0;

// represents all the blocks that are on the bottom
// when a new block reaches the staple, it is added to it
// let blockStaple = [
//   [/* Row 1 */],
//   [/* Row 2 */],
//   [/* Row 3 */],
//   [/* Row 4 */],
//   [/* Row 5 */],
//   [/* Row 6 */],
//   [/* Row 7 */],
//   [/* Row 8 */],
//   [/* Row 9 */],
//   [/* Row 10 */],
//   [/* Row 11 */],
//   [/* Row 12 */],
//   [/* Row 13 */],
//   [/* Row 14 */],
//   [/* Row 15 */],
//   [/* Row 16 */],
//   [/* Row 17 */],
//   [/* Row 18 */],
//   [/* Row 19 */],
//   [/* Row 20 */]
// ];

let blockStaple = Array.from({ length: 20 }).map(row => Array.from({ length: 10 }).map(square => null));

let squaresToClear = [];
let linesToClear = [];
let clearStep = 0;
let clearStepTimer = 0;

// represents the current and next descending block
let currentBlock;
let nextBlock;

// user interaction
let direction = 0;
let speedUp = 0;
let rotate = false;

// difficulty level
let level = 0;
let gravityTreshold = calculateGravityTimer(level);

let gameOver = false;

//
// Game Functions
//
function clearGame () {
  gravityTimer = 0;
  dalValue = 0;
  increaseDal = false;
  blockStaple = Array.from({ length: 20 }).map(row => Array.from({ length: 10 }).map(square => null));
  score = 0;
  linesCleared = 0;
  linesToClear = [];
  clearStepTimer = 0;
  clearStep = 0;
  direction = 0;
  speedUp = 0;
  rotate = false;
  level = 0;
  gravityTreshold = calculateGravityTimer(level);
  gameOver = false;

  // Get the first block
  currentBlock = getRandomShape();

  ui.stats[currentBlock.type].textContent = Number(ui.stats[currentBlock.type].textContent) + 1;
  ui.gravity.max.textContent = gravityTreshold;
  ui.level.textContent = `Level: ${level}`;

  // Get the next block
  nextBlock = getRandomShape();

  // Draw the background
  drawBackground(context);

  // Draw the next block
  drawShape(nextBlockContext, nextBlock.getBaseBlocks(), nextBlock.color);

  // Start the loop
  window.requestAnimationFrame(step);
}

function moveBlockLeft () {
  const nextMoveBlocks = currentBlock.getBlocks({ x: -1 });

  const hasCollision = nextMoveBlocks.some(
    block => checkBottomCollision(block) || checkEdgeCollision(block)
  );

  if (!hasCollision) {
    squaresToClear = [...squaresToClear, ...currentBlock.getBlocks()];
    currentBlock.moveLeft(); 
  }
}

function moveBlockRight () {
  const nextMoveBlocks = currentBlock.getBlocks({ x: 1 });

  const hasCollision = nextMoveBlocks.some(
    block => checkBottomCollision(block) || checkEdgeCollision(block)
  );

  if (!hasCollision) {
    squaresToClear = [...squaresToClear, ...currentBlock.getBlocks()];
    currentBlock.moveRight(); 
  }
}

function moveBlockDown () {
  const nextBlocks = currentBlock.getBlocks({ y: 1 });

  console.log('Move block down');
    
  if (nextBlocks.some(block => 
    checkBottomCollision(block)
  )) {
    console.log({ blockStaple });

    // Add block to staple
    if (addBlocksToStaple() === 1) {
      gameOver = true;
      if (score > topScore) {
        topScore = score;
        ui.score.top.textContent = topScore;
      }
    }

    if (!gameOver) {
      // create a new block
      currentBlock = nextBlock;

      // Update the stats panel
      ui.stats[currentBlock.type].textContent = Number(ui.stats[currentBlock.type].textContent) + 1;

      nextBlock = getRandomShape();

      // Draw next block
      drawShape(nextBlockContext, [{x: 0, y: 0},{x: 0, y: 0},{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 0, y: 1},{x: 1, y: 1},{x: 2, y: 1},{x: 3, y: 1},{x: 0, y: 2},{x: 1, y: 2},{x: 2, y: 2},{x: 3, y: 2}], '#fff');
      drawShape(nextBlockContext, nextBlock.getBaseBlocks(), nextBlock.color);

      // Draw staple
      drawStaple(context, blockStaple);
    }
  } else {
    squaresToClear = [...squaresToClear, ...currentBlock.getBlocks()];
    currentBlock.moveDown();
  }
}

function rotateBlock (isClockwise) {
  const nextMoveBlocks = currentBlock.getBlocks({ rotate: true });

  const hasCollision = nextMoveBlocks.some(
    block => checkBottomCollision(block) || checkEdgeCollision(block)
  );

  if (!hasCollision) {
    squaresToClear = [...squaresToClear, ...currentBlock.getBlocks()];
    currentBlock.rotate(isClockwise); 
  }
}

const actionDownHandlers = {
  moveLeft: () => {
    if (linesToClear.length > 0) {
      return;
    }
    if (direction === 1) {
      dalValue = 0;
    }
    direction = -1;
    if (!increaseDal) {
      moveBlockLeft();
    }
    increaseDal = true;
  },
  moveRight: () => {
    if (linesToClear.length > 0) {
      return;
    }
    if (direction === -1) {
      dalValue = 0;
    }
    direction = 1;
    if (!increaseDal) {
      moveBlockRight();
    }
    increaseDal = true;
  },
  moveDown: () => {
    moveBlockDown();
  },
  rotateClockwise: () => {
    rotateBlock(true);
  },
  rotateCounterClockwise: () => {
    rotateBlock(false);
  }
};

const actionUpHandlers = {
  moveLeft: () => {
    increaseDal = false;
  },
  moveRight: () => {
    increaseDal = false;
  },
  moveDown: () => {},
  rotateClockwise: () => {},
  rotateCounterClockwise: () => {}
};

function keyDownHandler (event) {
  const action = Object.keys(keyBindings).find(key => event.keyCode === keyBindings[key]);

  if (action !== undefined) {
    actionDownHandlers[action]();
  }
}

function keyUpHandler (event) {
  const action = Object.keys(keyBindings).find(key => event.keyCode === keyBindings[key]);

  if (action !== undefined) {
    actionUpHandlers[action]();
  }
}

function createCanvas () {
  const gameContainer = document.getElementById('gameContainer');
  const nextBlockContainer = document.getElementById('nextBlock');

  const gameCanvas = document.createElement('canvas');
  gameCanvas.className = 'game-canvas';
  gameCanvas.width = width;
  gameCanvas.height = height;

  const canvasNextBlock = document.createElement('canvas');
  canvasNextBlock.className = 'nextblock-canvas';
  canvasNextBlock.width = 120;
  canvasNextBlock.height = 90;

  gameContainer.appendChild(gameCanvas);
  nextBlockContainer.appendChild(canvasNextBlock);

  canvas = gameCanvas;
  context = gameCanvas.getContext('2d');

  nextBlockCanvas = canvasNextBlock;
  nextBlockContext = canvasNextBlock.getContext('2d');
}

function drawGameState() {
  if (gameOver) {
    drawGameOver(context);
    ui.gameOver.screen.style.display = 'flex';
  } else {
    // Clear the necessary blocks
    drawShape(context, squaresToClear, '#fff');

    // Reset the squares to clear
    squaresToClear = [];

    // Draw the current block
    drawShape(context, currentBlock.getBlocks(), currentBlock.color);
  }
}

function checkBottomCollision (block) {
  const {x, y} = block;

  if (y > 19) {
    return true;
  }

  // Check for collission with the other blocks
  return y > 0 && blockStaple[y][x] !== null;
  // return blockStaple.some(stapleBlock => {
  //   return stapleBlock.x === x && stapleBlock.y === y
  // });
}

function checkEdgeCollision (block) {
  const {x} = block;

  // Check for outer bounds (left, right, bottom)
  if (x < 0 || x > 9) {
    return true;
  }
}

function addBlocksToStaple () {
  let full = false;

  // Add the new block to the staple
  currentBlock.getBlocks().forEach(block => {
    console.log({ block });
    if (block.y > 0) {
      blockStaple[block.y][block.x] = currentBlock.color;
    } else {
      full = true;
    }
  });

  if (full) {
    return 1;
  }

  // Check for full lines
  const allEmpty = false;
  let i = blockStaple.length - 1;

  while (!allEmpty && i >= 0) {
    let emptySquares = 0;
    
    const fullLine = blockStaple[i].every(square => {
      if (square === null) {
        emptySquares++;
      }

      return square !== null
    });

    if (emptySquares === 10) {
      allEmpty = true;
    }

    if (fullLine) {
      linesToClear.push(i);
    }

    i--;
  }

  return 0;
}

// Step will update the game state and then redraw it
function step (t) {
  // Update UI framerate value
  // const frameRate = Math.round(1000 / (t - timeStamp));
  secondsPassed = (t - oldTimeStamp) / 1000;
  oldTimeStamp = t;

  // If there are lines to clear we stop the gravity timer and remove the lines, 1 block per frame untill it is gone
  // then move the remaining lines down and activate the gravity again by emptying the lines to clear array
  if (linesToClear.length > 0) {
    // Reset some variables
    gravityTimer = 1;
    direction = 0;
    
    if (clearStepTimer >= 10) {
      linesToClear.forEach(lineNumber => {
        blockStaple[lineNumber][clearStep] = null;
        drawSquare(context, clearStep, lineNumber, '#fff');
      });
  
      // If we arrive at step 9 we remove the lines, count the score and reset the filled lines
      if (clearStep >= 9) {
        linesToClear.sort();

        // Move the lines down
        linesToClear.forEach(lineNumber => {
          blockStaple.splice(lineNumber, 1);
          blockStaple.splice(0, 0, Array.from({ length: 10 }).map(x => null));
        });

        // Count the score
        score += getPoints(level, linesToClear.length);
        ui.score.current.textContent = score;

        linesCleared += linesToClear.length;

        // Check if need to go to next level
        const newLevel = Math.floor(linesCleared / 10);

        // Level up
        if (newLevel !== level) {
          level = newLevel;
          gravityTreshold = calculateGravityTimer(level);
          ui.level.textContent = `Level: ${level}`;
          ui.gravity.max.textContent = gravityTreshold;
        }
  
        // Resume game
        linesToClear = [];
        clearStep = 0;
        clearStepTimer = 0;
      } else {
        clearStep++;
      }
  
      drawBackground(context);
      drawStaple(context, blockStaple);
    } else {
      clearStepTimer = ((clearStepTimer + 1) % 40)
    }
  } else {
    gravityTimer = ((gravityTimer + 1) % gravityTreshold);
    ui.gravity.current.textContent = gravityTimer;
  }

  if (increaseDal) {
    dalValue = dalValue >= 16 ? 10 : dalValue + 1;
    ui.dal.value.textContent = dalValue;
    ui.dal.bar.style.width = `${Math.round(dalValue / 16 * 125)}px`;
  }

  fps = Math.round(1 / secondsPassed);
  ui.frameRate.textContent = `${fps} fps`;

  // Move the block sideways
  if (dalValue === 16) {
    if (direction === -1) {
      moveBlockLeft();
      dalValue = 10;
    }
    if (direction === 1) {
      moveBlockRight();
      dalValue = 10;
    }
  }

  // Move the block down
  if (gravityTimer === 0) {
    moveBlockDown();
  }

  // Redraw the game
  drawGameState();

  // request new anim frame
  if (!gameOver) {
    window.requestAnimationFrame(step);
  }
}

function startGame() {
  // Setup canvas and get the context
  createCanvas();

  // Hook up the keyboard listeners
  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);

  ui.gameOver.restart.addEventListener('click', () => {
    ui.gameOver.screen.style.display = 'none';
    clearGame();
  });

  clearGame();
}

startGame();
