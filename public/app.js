import { board } from "./board.js";
import { BOARD_SIZE } from "./constants.js";

const overlayHtml = document.getElementById("pause-overlay"),
  controlLegendHtml = document.getElementById("control-legend"),
  gameTitleHtml = document.getElementById("game-title"),
  dPadHtml = document.getElementById("d-pad"),
  upDpadHtml = document.getElementById("d-pad-up"),
  downDpadHtml = document.getElementById("d-pad-down"),
  leftDpadHtml = document.getElementById("d-pad-left"),
  rightDpadHtml = document.getElementById("d-pad-right");

let isTouchable;

document.addEventListener("DOMContentLoaded", function () {
  isTouchable =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  // Mobile (touchable)
  if (isTouchable) {
    overlayHtml.innerText = "Touch here";
    overlayHtml.classList.add("blink-animation");

    controlLegendHtml.style.display = "none";

    overlayHtml.addEventListener("click", function () {
      board.togglePause();
    });

    upDpadHtml.addEventListener("click", function () {
      if (board.getIsPaused() === undefined) {
        board.togglePause();
      } else {
        board.setSnakeDirection("up");
      }
    });

    downDpadHtml.addEventListener("click", function () {
      if (board.getIsPaused() === undefined) {
        board.togglePause();
      } else {
        board.setSnakeDirection("down");
      }
    });

    leftDpadHtml.addEventListener("click", function () {
      if (board.getIsPaused() === undefined) {
        board.togglePause();
      } else {
        board.setSnakeDirection("left");
      }
    });

    rightDpadHtml.addEventListener("click", function () {
      if (board.getIsPaused() === undefined) {
        board.togglePause();
      } else {
        board.setSnakeDirection("right");
      }
    });
  }
  // Desktop
  else {
    dPadHtml.style.display = "none";
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

    controlLegendHtml.addEventListener("click", function (event) {
      board.togglePause();
    });
  }
});

export function updateUIScore(count) {
  const progressPercentage = ((count * 100) / BOARD_SIZE) * 5;

  gameTitleHtml.style.background = `linear-gradient(90deg, #ff0000 ${progressPercentage}%, #ffcc00 ${progressPercentage}%)`;
  gameTitleHtml.style.backgroundClip = "text";
}

export function updateUITogglePause() {
  const isPaused = board.getIsPaused(),
    isGameOver = isPaused === undefined;

  overlayHtml.innerHTML = isPaused
    ? "Game Paused"
    : "<div><p>Game Over</p><p>Score: 3</p></p></div>";
  overlayHtml.style.visibility = isPaused || isGameOver ? "visible" : "hidden";
  overlayHtml.classList[isGameOver ? "add" : "remove"]("blink-animation");
  controlLegendHtml.classList[isPaused || isGameOver ? "add" : "remove"](
    "zoom-animation"
  );
}
