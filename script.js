'use strict';
// is general comment

/** is comment for specific comment */

// Connection from html elements
const canvas = document.getElementById("gameCanvas");
const canvas_ctx = canvas.getContext("2d");
const displayScore = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const scoreNum = document.getElementById("scoreNum");

// Snake body colors
const border = "black";
const background = "lightGreen";
const snakeFill = "lightblue";
const snakeStroke = "darkBlue";

/** Determines the game speed but not very important. The lower the number, the faster the game but not lower than 80. */
let gameSpeed = 120;

/**Game Score*/
let score = 0;

// Deciding the direction of the snake
let dx = -10, dy = 0;

/** Start parts of the snake body */
let snake = [
  { x: 200, y: 200 },
  { x: 210, y: 200 },
  { x: 220, y: 200 },
  { x: 230, y: 200 }
];

// For random fruit position (making the variable global scope)
let random_x;
let random_y;

// Calling the changeDirection function every time the user click the navigation button
document.addEventListener("keydown", changeDirection);

// Calling the clearCanvas function to display green playground
clearCanvas();

/** 
 * Make the canvas clean first and then create snake parts and also the core function of the game 
 * To check every frame.
*/
function main() {
  if (hasGameEnded()) {
    // Reassigning the snake part from the beginning of the game
    snake = [
      { x: 200, y: 200 },
      { x: 210, y: 200 },
      { x: 220, y: 200 },
      { x: 240, y: 200 }
    ];
    dx = -10;
    dy = 0;
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
    // Moving snake after specific time to make the snake move
    setTimeout(() => {
      clearCanvas();
      moving();
      drawSnake();
      drawFood();
      main();
    }, gameSpeed);
  }
}

/** A collection of functions for snake movement during game */
function coreGame() {
  moving();
  drawSnake();
  clearCanvas();
  drawFood();
  main();
}

/** Making the game start only when the user pressed the button */
function startGame() {
  coreGame();
  random_food();
  displayScore.style.display = "block";
  startBtn.style.display = "none";
}

/** A function to loop through the snake object to create individual snake parts */
function drawSnake() {
  snake.forEach(drawingSnakeParts);
}

/** A function for moving, and also for checking if the snake has eaten food.
 *  If eaten, increase score and lower the game refresh rate.
 */
function moving() {
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  // If the snake has eaten the food,
  // Keep the tail and generate new food.
  // Else, delete (pop) the last part.
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
 * Navigation the snake with keyboard arrow keys, WASD keys and onScreen control.
 * @param {KeyboardEvent} event Changing the direction of snake with various input.
 */
function changeDirection(event) {

  // Checking the snake direction
  const goingDown = dy === 10;
  const goingUp = dy === -10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  // Determining which key is pressed for direction, WASD keys or arrow keys or onScreen button
  const isLeftKeyPressed = (event.key || event) === ('a' || 'ArrowLeft');
  const isRightKeyPressed = (event.key || event) === ('d' || 'ArrowRight');
  const isUpKeyPressed = (event.key || event) === ('w' || 'ArrowUp');
  const isDownKeyPressed = (event.key || event) === ('s' || 'ArrowDown');

  // Ensuring the snake not to go backward and change to opposite direction.
  // And change the direction.
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
  // Checking if the snake has collided itself
  for (let i = 1; i < snake.length; i++) {
    let hasCollidedItself = snake[0].x === snake[i].x && snake[0].y === snake[i].y;
    // Do not return hasCollidedItself directly
    // If so, the function will not check colliding walls
    if (hasCollidedItself) {
      return true;
    }
  }
  // Checking if the snake has collided wall
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
 * For generating random_x and random_y coordinates
 * @returns coordinate within canvas
 */
function randomXY() {
  return random_place(0, canvas.width - 10);
}

/**
 * Generating random food while checking the food not to be in the snake body
 */
function random_food() {
  // Used global scope here so, drawFood function can access
  random_x = randomXY();
  random_y = randomXY();

  // To make sure the food not to produce at each snake part
  // Check if the food is generated at snake parts
  // If true, produce food again.
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