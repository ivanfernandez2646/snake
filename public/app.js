import { board } from "./board.js";

const scoreHtml = document.getElementById("score");

document.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  if (event.key === "ArrowRight") {
    board.setSnakeDirection("right");
  } else if (event.key === "ArrowLeft") {
    board.setSnakeDirection("left");
  } else if (event.key === "ArrowUp") {
    board.setSnakeDirection("up");
  } else if (event.key === "ArrowDown") {
    board.setSnakeDirection("down");
  }
});

export function updateUIScore(count) {
  scoreHtml.innerText = `Score:${count}`
}

board.start();
