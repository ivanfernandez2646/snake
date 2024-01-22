import { board } from "./board.js";

const scoreHtml = document.getElementById("score"),
  overlay = document.getElementById("pause-overlay"),
  controlLegend = document.getElementById("control-legend");

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
  } else if (event.key === "Space" || event.key === " ") {
    board.togglePause();
  }
});

export function updateUIScore(count) {
  scoreHtml.innerText = `Score:${count}`;
}

export function updateUITogglePause() {
  const isPaused = board.getIsPaused();

  overlay.style.visibility = isPaused ? "visible" : "hidden";
  controlLegend.classList[isPaused ? "add" : "remove"]("zoom-animation");
}

board.start();
