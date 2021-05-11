const canvas = document.getElementById("gameCanvas");
const canvas_ctx = canvas.getContext("2d");
let gameSpeed = 120;
let score = 0;

// Deciding the direction of the snake
let dx = 0;
let dy = 0;
randomDirection();

// Snake body start parts
let snake = randomSnakeParts();

let displayScore = document.getElementById("score");
let startBtn = document.getElementById("startBtn");
let scoreNum = document.getElementById("scoreNum");

// For random fruit position (making the variable global scope)
let random_x;
let random_y;

// Snake body colors
const border = "black";
const background = "lightGreen";
const snakeFill = "lightblue";
const snakeStroke = "darkBlue";

/**Calling the changeDirection function every time the user click the navigation button */
document.addEventListener("keydown", changeDirection);

// Calling the clearCanvas function to display green playground
clearCanvas();

/**Make the canvas clean first and then create snake parts and also the core function of the game */
function main() {
  if (hasGameEnded()) {
    // Reassigning the snake part original start status in order to return to the beginning
    snake = randomSnakeParts();
    console.log(snake);
    clearCanvas();
    if (confirm(`Game Over! Your score is ${score}. Do you want to restart the game?`)) {
      startGame();
      score = 0;
    } else {
      displayScore.style.display = "none";
      startBtn.style.display = "block";
      score = 0;
    }
  } else {
    /** 
     * Moving snake after specific time
     */
    setTimeout(() => {
      clearCanvas();
      drawSnake();
      drawFood();
      moving();
      main();
    }, gameSpeed);
  }
}

/**
 * A collection of functions for snake movement during game
 */
function coreGame() {
  moving();
  drawSnake();
  clearCanvas();
  drawFood();
  main();
}

/**
 * Making the game start only when the user pressed the button
 */
function startGame() {
  coreGame();
  random_food();
  displayScore.style.display = "block";
  startBtn.style.display = "none";
}

/**
 * A function to loop through the snake object to create individual snake parts
 */
function drawSnake() {
  snake.forEach(drawingSnakeParts);
}

/* function for moving via dx and dy */
function moving() {
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // If the snake has eaten the food
  // Keep the tail and generate new food
  // Else, delete (pop) the last part
  if (snake[0].x === random_x && snake[0].y === random_y) {
    score += 1;
    if (gameSpeed >= 80) {
      gameSpeed -= 2;
    }
    random_food();
  } else {
    snake.pop();
  }
  scoreNum.innerHTML = score;
}

/**
 * Navigation the snake with keyboard arrow keys and WASD keys  
 * @param {KeyboardEvent} event Changing the direction of snake with Keyboard
 */
function changeDirection(event) {
  let keyPressed;

  // For arrow keys navigation
  const upKey = 38;
  const leftKey = 37;
  const downKey = 40;
  const rightKey = 39;

  // For WASD keys navigation
  const wKey = 87;
  const aKey = 65;
  const sKey = 83;
  const dKey = 68;

  // Checking the snake direction
  let goingDown = dy === 10;
  let goingUp = dy === -10;
  let goingRight = dx === 10;
  let goingLeft = dx === -10;

  // Deciding the parameter whether it is onscreen button or keyboard's key by checking data type
  // If onscreen button, set the keyPressed to the clicked direction accordingly
  if (typeof (event) === "string") {
    if (event === "Up") {
      keyPressed = upKey;
    } else if (event === "Down") {
      keyPressed = downKey;
    } else if (event === "Left") {
      keyPressed = leftKey;
    } else if (event === "Right") {
      keyPressed = rightKey;
    }
  } else {
    keyPressed = event.keyCode;
  }

  // Determining which key is pressed for direction, WASD keys or arrow keys
  const isLeftKeyPressed = leftKey === keyPressed || aKey === keyPressed;
  const isRightKeyPressed = rightKey === keyPressed || dKey === keyPressed;
  const isUpKeyPressed = upKey === keyPressed || wKey === keyPressed;
  const isDownKeyPressed = downKey === keyPressed || sKey === keyPressed;

  /* Ensuring the snake not to go backward and changing its direction*/
  if (isLeftKeyPressed && !goingRight) {
    dx = -10;
    dy = 0;
  } else if (isRightKeyPressed && !goingLeft) {
    dx = 10;
    dy = 0;
  } else if (isUpKeyPressed && !goingDown) {
    dx = 0;
    dy = -10;
  } else if (isDownKeyPressed && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

/**
 * Checking game condition, if the snake has collided to the wall or itself
 * @returns Has snake reached to its own body or wall
 */
function hasGameEnded() {
  /** Checking if the snake has collided itself */
  for (let i = 1; i < snake.length; i++) {
    const hasCollidedItself = snake[0].x === snake[i].x && snake[0].y === snake[i].y;
    if (hasCollidedItself) {
      console.log("Collied itself");
      return true;
    }
  }
  //  Checing if the snake has collided wall
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitLeftWall = snake[0].x < 0;
  const hitUpWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  console.log("Collided wall");
  return hitRightWall || hitLeftWall || hitUpWall || hitBottomWall;
}

/**
 * Generating random number between maxinum and minimun
 * @param {Number} min Minimum Number
 * @param {number} max Maximun Number 
 * @returns A random number between maximun and minimun
 */
function random_place(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

/**
 * For generting random_x and random_y
 * @returns random place within canvas
 */
function randomXY() {
  return random_place(0, canvas.width - 10);
}

/**
 * Generating random food while checking not the food to be in snake body
 */
function random_food() {
  random_x = randomXY();
  random_y = randomXY();
  /**
   * To make sure the food not to produce at snake parts
   * Check if the food is generated at snake parts
   * If true, produce food again.
   */
  snake.forEach((snake_part) => {
    if (random_x === snake_part.x && random_y === snake_part.y) {
      return random_food();
    }
  });
}

/**
 * Clearing Canvas
 */
function clearCanvas() {
  canvas_ctx.fillStyle = background;
  canvas_ctx.strokeStyle = border;
  canvas_ctx.fillRect(0, 0, canvas.height, canvas.width);
  canvas_ctx.strokeRect(0, 0, canvas.height, canvas.width);
}

/**
 * Generating individual snake parts
 * @param {Object} snakeParts Individual snake parts with x and y object
 */
function drawingSnakeParts(snakeParts) {
  canvas_ctx.fillStyle = snakeFill;
  canvas_ctx.strokeStyle = snakeStroke;
  canvas_ctx.fillRect(snakeParts.x, snakeParts.y, 10, 10);
  canvas_ctx.strokeRect(snakeParts.x, snakeParts.y, 10, 10);
}

/**
 * Drawing Food dot
 */
function drawFood() {
  canvas_ctx.fillStyle = "red";
  canvas_ctx.strokeStyle = "darkred";
  canvas_ctx.fillRect(random_x, random_y, 10, 10);
  canvas_ctx.strokeRect(random_x, random_y, 10, 10);
}

/**
 * Generating random locations for x and y of snake parts
 */
function randomSnakeParts() {
  let random_x = randomXY();
  let random_y = randomXY();
  let snake = [
    { x: random_x, y: random_y },
    { x: random_x += dx, y: random_y += dy },
    { x: random_x += dx, y: random_y += dy },
    { x: random_x += dx, y: random_y += dy }
  ];
  return snake;
}

/**
 * To go to random direction at first
 */
function randomDirection() {
  (Math.round(Math.random())) ? dy = 10 : dx = 10;
}
