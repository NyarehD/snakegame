const canvas = document.getElementById("gameCanvas");
const canvas_ctx = canvas.getContext("2d");
let snake = [ {x: 200, y:200}, {x: 190, y: 200}, {x: 180, y: 200}, {x: 170, y:200 }];

/* Colors */
const border = 'black';
const background = 'white';
let snakeFill = 'lightBlue';
let snakeStroke = 'darkBlue';


main();
function main(){
  drawSnake();

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