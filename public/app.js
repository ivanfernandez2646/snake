import { board } from "./board.js";
import { BOARD_SIZE } from "./constants.js";

const scoreHtml = document.getElementById("score"),
  overlay = document.getElementById("pause-overlay"),
  controlLegend = document.getElementById("control-legend"),
  gameTitle = document.getElementById("game-title");

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

controlLegend.addEventListener("click", function (event) {
  board.togglePause();
});

export function updateUIScore(count) {
  scoreHtml.innerText = `Score:${count}`;

  const progressPercentage = ((count * 100) / BOARD_SIZE) * 5;

  gameTitle.style.background = `linear-gradient(90deg, #ff0000 ${progressPercentage}%, #ffcc00 ${progressPercentage}%)`;
  gameTitle.style.backgroundClip = "text";
}

export function updateUITogglePause() {
  const isPaused = board.getIsPaused(),
    isGameOver = isPaused === undefined;

  overlay.innerText = isPaused ? "Game Paused" : "Game Over";
  overlay.style.visibility = isPaused || isGameOver ? "visible" : "hidden";
  overlay.classList[isGameOver ? "add" : "remove"]("blink-animation");
  controlLegend.classList[isPaused || isGameOver ? "add" : "remove"](
    "zoom-animation"
  );
}
