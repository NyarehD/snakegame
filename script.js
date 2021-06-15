'use strict';
const canvas = document.getElementById("gameCanvas");
const canvas_ctx = canvas.getContext("2d");
let gameSpeed = 120;
let score = 0;

// Deciding the direction of the snake
let dx = -10;
let dy = 0;

// Snake body start parts
let snake = [
  {x: 200, y:200},
  {x: 210, y: 200},
  {x: 220, y: 200},
  {x: 230, y: 200}
];

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
    snake = [
      {x: 200, y:200},
      {x: 210, y: 200},
      {x: 220, y: 200},
      {x: 240, y: 200}
    ];
    dx = -10;
    dy = 0;
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

  // Checking the snake direction
  const goingDown = dy === 10;
  const goingUp = dy === -10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  // Determining which key is pressed for direction, WASD keys or arrow keys or assets button
  const isLeftKeyPressed = (event.key || event) === ('a' || 'ArrowLeft');
  const isRightKeyPressed =  (event.key || event) === ('d' || 'ArrowRight');
  const isUpKeyPressed = (event.key || event) === ('w' || 'ArrowUp');
  const isDownKeyPressed =  (event.key || event) === ('s' || 'ArrowDown');

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
    let hasCollidedItself = snake[0].x === snake[i].x && snake[0].y === snake[i].y;
    if (hasCollidedItself) {
      console.log("Collied itself");
      return true;
    }
  }
  //  Checking if the snake has collided wall
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitLeftWall = snake[0].x < 0;
  const hitUpWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  return hitRightWall || hitLeftWall || hitUpWall || hitBottomWall;
}

/**
 * Generating random number between maximum and minimum parameter
 * @param {Number} min Minimum Number
 * @param {number} max Maximum Number
 * @returns A random number between maximum and minimum
 */
function random_place(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

/**
 * For generating random_x and random_y
 * @returns random x and y coordinate within canvas
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
  return "I love vscode";
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

