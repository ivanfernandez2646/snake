import { Board } from "./board.js";

const board = new Board();

document.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  if (event.key === "ArrowRight") {
    board.snake.setDirection("right");
  } else if (event.key === "ArrowLeft") {
    board.snake.setDirection("left");
  } else if (event.key === "ArrowUp") {
    board.snake.setDirection("up");
  } else if (event.key === "ArrowDown") {
    board.snake.setDirection("down");
  }
});

board.start();
