const canvas = document.getElementById("gameCanvas");
const canvas_ctx = canvas.getContext("2d");
let snake = [ {x: 200, y:200}, {x: 190, y: 200}, {x: 180, y: 200}, {x: 170, y:200}];
let dx = 10;
let dy = 0;
/* Colors */
const border = 'black';
const background = 'white';
const snakeFill = 'lightBlue';
const snakeStroke = 'darkBlue';

document.addEventListener("keydown", changeDirection);

main();
/* Make the canvas clean first and then create snake parts */
function main(){
  setTimeout(function onTick(){
    clearCanvas();  
    drawSnake();
    moving();
    main();
  }, 100);
}
/* Clearing canvas */
function clearCanvas(){
  canvas_ctx.fillStyle = background;
  canvas_ctx.strokeStyle = border;
  canvas_ctx.fillRect(0,0,canvas.height, canvas.width);
  canvas_ctx.strokeRect(0,0,canvas.height, canvas.width);
}

/* function for drawing snake parts */

function drawingSnakeParts(snakeParts){
  canvas_ctx.fillStyle = snakeFill;
  canvas_ctx.strokeStyle = snakeStroke;
  canvas_ctx.fillRect(snakeParts.x, snakeParts.y, 10, 10);
  canvas_ctx.strokeRect(snakeParts.x, snakeParts.y, 10, 10);
}

function drawSnake(){
    snake.forEach(drawingSnakeParts);
}

/* functin for moving x-axis */
function moving(){
  let head = {x: snake[0].x+dx, y: snake[0].y+dy};
  snake.unshift(head);
  snake.pop();
}

function changeDirection(event){
  const leftKey = 37;
  const rightKey = 39;
  const upKey = 38;
  const downKey = 40;

  let keyPressed = event.keyCode;
  let goingDown = dy === 10;
  let goingUp = dy === -10;
  let goingRight = dx === 10;
  let goingLeft = dx === -10;
  
  if (leftKey === keyPressed && !goingRight){
    dx = -10;
    dy = 0;
  }else if (rightKey === keyPressed && !goingLeft){
    dx = 10;
    dy = 0;
  }else if (upKey === keyPressed && !goingDown){
    dx = 0;
    dy = -10;
  }else if (downKey === keyPressed && !goingUp){
    dx = 0;
    dy = 10;
  }
}
