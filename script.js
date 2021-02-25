const canvas = document.getElementById("gameCanvas");
const canvas_ctx = canvas.getContext("2d");
let snake = [{x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200}
];
let dx = 10;
let dy = 0;
let random_x;
let random_y;
/* Colors */
const border = 'black';
const background = 'lightGreen';
const snakeFill = 'lightblue';
const snakeStroke = 'darkBlue';

let score = 0;

// Calling the changeDirection function everytime the user click the navigation button 
document.addEventListener("keydown", changeDirection);
// The main function to run at the beginning of all
main();
random_food();
/* Make the canvas clean first and then create snake parts */
function main(){
  if(hasGameEnded()){
    if(confirm("Game Over!")){
      location.reload();
    };
  }else{
    setTimeout(function onTick(){
      clearCanvas();  
      drawSnake();
      drawFood();
      moving();
      main();
    }, 100);
  }
}

/* Clearing canvas */
function clearCanvas(){
  canvas_ctx.fillStyle = background;
  canvas_ctx.strokeStyle = border;
  canvas_ctx.fillRect(0,0,canvas.height, canvas.width);
  canvas_ctx.strokeRect(0,0,canvas.height, canvas.width);
}

/* function for drawing a snake part */
function drawingSnakeParts(snakeParts){
  canvas_ctx.fillStyle = snakeFill;
  canvas_ctx.strokeStyle = snakeStroke;
  canvas_ctx.fillRect(snakeParts.x, snakeParts.y, 10, 10);
  canvas_ctx.strokeRect(snakeParts.x, snakeParts.y, 10, 10);
}

/* A function to loop through the snake object to create individual snake parts */
function drawSnake(){
  snake.forEach(drawingSnakeParts);
}

/* functin for moving via dx and dy */
function moving(){
  let head = {x: snake[0].x+dx, y: snake[0].y+dy};
  snake.unshift(head);
  console.log("Snake is moving");
  if(snake[0].x === random_x && snake[0].y === random_y){
    score += 1;
    document.querySelector('span').innerHTML = score;
    random_food();
    console.log("Snake has eaten");
  }else{
    snake.pop();
  }
}

/* Navigation the snake with keyboard arrow keys and WASD keys */
function changeDirection(event){
  let keyPressed = event.keyCode;

  const leftKey = 37;
  const rightKey = 39;
  const upKey = 38;
  const downKey = 40;
  const wKey = 87;
  const aKey = 65;
  const sKey = 83;
  const dKey = 68;

  let goingDown = dy === 10;
  let goingUp = dy === -10;
  let goingRight = dx === 10;
  let goingLeft = dx === -10;
  
  /* Determining which key is pressed for direction, WASD keys or arrow keys */
  const isLeftKeyPressed = leftKey === keyPressed || aKey === keyPressed;
  const isRightKeyPressed = rightKey === keyPressed || dKey === keyPressed;
  const isUpKeyPressed = upKey === keyPressed || wKey === keyPressed;
  const isDownKeyPressed = downKey === keyPressed || sKey === keyPressed;

  /* Ensuring the snake not to go backward */
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

/* Checking game condition */
/* If the snake has collided to the wall or itself */
function hasGameEnded(){
  /* Checking if the snake has collided itself */
  for(var i = 4; i< snake.length; i++){
    const hasCollidedItself = snake[0].x === snake[i].x && snake[0].y === snake[i].y;
    if(hasCollidedItself){
      return true;
    }
  }
  /* Checking if the snake has collided wall */
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitLeftWall = snake[0].x < 0;
  const hitUpWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  return hitRightWall || hitLeftWall || hitUpWall || hitBottomWall;
}

function random_place(min, max){
  return Math.round((Math.random()*(max - min) + min)/ 10)*10;
}

function random_food(){
  random_x = random_place(0, canvas.width - 10);
  random_y = random_place(0, canvas.height - 10);
  snake.forEach(function has_snake_eaten(snake_part){
    if(random_x === snake_part.x && random_y === snake_part.y){
      return random_food();
    }
  })
}

function drawFood(){
  canvas_ctx.fillStyle = 'red';
  canvas_ctx.strokeStyle = 'darkred';
  canvas_ctx.fillRect(random_x, random_y, 10, 10);
  canvas_ctx.strokeRect(random_x, random_y, 10, 10);
}