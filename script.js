const canvas = document.getElementById("gameCanvas");
const canvas_ctx = canvas.getContext("2d");
let gameSpeed = 120;
let score = 0;

// Snake body start parts
let snake = [{x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200}
];

// Deciding the direction of the snake
let dx = 10;
let dy = 0;

let displayScore = document.getElementById('score');
let startBtn = document.getElementById('startBtn');
let scoreNum = document.getElementById('scoreNum');

// For random fruit position (making the variable global scope)
let random_x;
let random_y;

// Snake body colors
const border = 'black';
const background = 'lightGreen';
const snakeFill = 'lightblue';
const snakeStroke = 'darkBlue';

// Calling the changeDirection function every time the user click the navigation button
document.addEventListener("keydown", changeDirection);

// Calling the clearCanvas function to display green playground
clearCanvas();

/* Make the canvas clean first and then create snake parts */
// Also the core function of the game
function main(){
  if(hasGameEnded()){
    if(confirm(`Game Over! Your score is ${score}. Do you want to restart the game?`)){
      // Reassigning the snake part original start status in order to return to the beginning
      snake = [{x: 200, y: 200},
        {x: 190, y: 200},
        {x: 180, y: 200},
        {x: 170, y: 200}
      ];
      startGame();
    }else{
      displayScore.style.display = 'none';
      startBtn.style.display = 'block';
      clearCanvas(); 
    }
  }else{
    setTimeout(function onTick(){
      clearCanvas();  
      drawSnake();
      drawFood();
      moving();
      main();
    }, gameSpeed);
  }
}

/* A function to loop through the snake object to create individual snake parts */
function drawSnake(){
  snake.forEach(drawingSnakeParts);
}

// Making the game start only when the user pressed the button
function startGame(){
  main();
  random_food();
  displayScore.style.display = 'block';
  startBtn.style.display = 'none';
}

/* function for moving via dx and dy */
function moving(){
  let head = {x: snake[0].x+dx, y: snake[0].y+dy};
  snake.unshift(head);

  // If the snake has eaten the food
  // Keep the tail and generate new food
  // Else, delete (pop) the last part
  if(snake[0].x === random_x && snake[0].y === random_y){
    score += 1;
    scoreNum.innerHTML = score;
    if(gameSpeed>=80){
      gameSpeed-=2;
    }
    random_food();
  }else{
    snake.pop();
  }
}

/* Navigation the snake with keyboard arrow keys and WASD keys */
function changeDirection(event){
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
  if(typeof(event)==="string"){
    if(event === "Up"){
      keyPressed = upKey;
    }else if(event === "Down"){
      keyPressed = downKey;
    }else if(event === "Left"){
      keyPressed = leftKey;
    }else if(event === "Right"){
      keyPressed = rightKey;
    }
  }else{
    keyPressed = event.keyCode;
  }
  
  // Determining which key is pressed for direction, WASD keys or arrow keys
  const isLeftKeyPressed = leftKey === keyPressed || aKey === keyPressed;
  const isRightKeyPressed = rightKey === keyPressed || dKey === keyPressed;
  const isUpKeyPressed = upKey === keyPressed || wKey === keyPressed;
  const isDownKeyPressed = downKey === keyPressed || sKey === keyPressed;
  
  /* Ensuring the snake not to go backward and changing its direction*/
  if (isLeftKeyPressed && !goingRight){
    dx = -10;
    dy = 0;
  }else if (isRightKeyPressed && !goingLeft){
    dx = 10;
    dy = 0;
  }else if (isUpKeyPressed && !goingDown){
    dx = 0;
    dy = -10;
  }else if (isDownKeyPressed && !goingUp){
    dx = 0;
    dy = 10;
  }
}

//  Checking game condition
//  If the snake has collided to the wall or itself 
function hasGameEnded(){
  // Checking if the snake has collided itself
  for(let i = 1; i< snake.length; i++){
    const hasCollidedItself = snake[0].x === snake[i].x && snake[0].y === snake[i].y;
    if(hasCollidedItself){
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

/* For generating random numbers */
function random_place(min, max){
  return Math.round((Math.random()*(max - min) + min)/ 10)*10;
}

function random_food(){
  random_x = random_place(0, canvas.width - 10);
  random_y = random_place(0, canvas.height - 10);
  // To make sure the food not to produce at snake parts
  // Check if the food is generated at snake parts
  // If true, produce food again.
  snake.forEach(function has_snake_eaten(snake_part){
    if(random_x === snake_part.x && random_y === snake_part.y){
      return random_food();
    }
  })
}

/* Clearing canvas */
function clearCanvas(){
  canvas_ctx.fillStyle = background;
  canvas_ctx.strokeStyle = border;
  canvas_ctx.fillRect(0,0,canvas.height, canvas.width);
  canvas_ctx.strokeRect(0,0,canvas.height, canvas.width);
}

/* Function for drawing individual snake part */
function drawingSnakeParts(snakeParts){
  canvas_ctx.fillStyle = snakeFill;
  canvas_ctx.strokeStyle = snakeStroke;
  canvas_ctx.fillRect(snakeParts.x, snakeParts.y, 10, 10);
  canvas_ctx.strokeRect(snakeParts.x, snakeParts.y, 10, 10);
}

function drawFood(){
  canvas_ctx.fillStyle = 'red';
  canvas_ctx.strokeStyle = 'darkred';
  canvas_ctx.fillRect(random_x, random_y, 10, 10);
  canvas_ctx.strokeRect(random_x, random_y, 10, 10);
}