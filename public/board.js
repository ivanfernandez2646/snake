import { BOARD_SIZE, PIECE_SIZE, SPEED_INTERVAL } from "./constants.js";
import { Apple } from "./apple.js";
import { Snake, SnakePiece } from "./snake.js";
import { updateUIScore, updateUITogglePause } from "./app.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

class Board {
  #snake;
  #clockInterval;
  #speed;
  #apple;
  #countApples;
  #availablePositionsForNewApple;
  #isPaused;

  constructor() {
    this.#snake = undefined;
    this.#clockInterval = undefined;
    this.#speed = SPEED_INTERVAL;
    this.#apple = undefined;
    this.#countApples = 0;
    this.#availablePositionsForNewApple = (() => {
      const res = [];
      let i = 0;
      do {
        res.push(i * PIECE_SIZE);
        i++;
      } while (res[res.length - 1] < BOARD_SIZE - PIECE_SIZE);
      return res;
    })();
    this.#isPaused = undefined;

    if (typeof Board.instance === "object") {
      return Board.instance;
    }

    Board.instance = this;
    return this;
  }

  // Getters
  getApple() {
    return this.#apple;
  }

  getIsPaused() {
    return this.#isPaused;
  }

  // Setters
  setSnakeDirection(direction) {
    this.#snake.setDirection(direction);
  }

  setCountApples(countApples) {
    this.#countApples = countApples;
    updateUIScore(this.#countApples);
  }

  // Public methods
  reset() {
    new Howl({
      preload: true,
      src: [`./assets/crash${Math.floor(Math.random() * (2 - 1 + 1) + 1)}.m4a`],
    }).play();
    this.#snake.reset();
    this.#speed = SPEED_INTERVAL;
    this.#isPaused = undefined;
    clearInterval(this.#clockInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateUITogglePause();
  }

  generateNewApple() {
    new Howl({
      src: [`./assets/eat.m4a`],
    }).play();
    this.#increaseSpeed();

    const frozenPieces = this.#snake.getPieces();
    let tmpXNewApple, tmpYNewApple;

    do {
      tmpXNewApple =
        this.#availablePositionsForNewApple[
          Math.floor(Math.random() * this.#availablePositionsForNewApple.length)
        ];
      tmpYNewApple =
        this.#availablePositionsForNewApple[
          Math.floor(Math.random() * this.#availablePositionsForNewApple.length)
        ];
    } while (
      tmpXNewApple % PIECE_SIZE !== 0 ||
      tmpYNewApple % PIECE_SIZE !== 0 ||
      frozenPieces.some((piece) =>
        piece.isCollision(new SnakePiece({ x: tmpXNewApple, y: tmpYNewApple }))
      )
    );

    this.#apple = new Apple({ x: tmpXNewApple, y: tmpYNewApple });
    this.#apple.draw();
  }

  togglePause() {
    if (this.#isPaused) {
      this.#isPaused = false;
      this.#setClockInterval();
    } else {
      if (this.#isPaused === undefined) {
        this.#isPaused = false;
        this.#start();
      } else {
        this.#isPaused = true;
        clearInterval(this.#clockInterval);
      }
    }

    updateUITogglePause();
  }

  // Private methods
  #start() {
    this.#snake = new Snake({ x: 0, y: 0 });
    this.#apple = new Apple({ x: 20, y: 20 });
    this.#snake.draw();
    this.#apple.draw();
    this.setCountApples(0);
    this.#setClockInterval();
  }

  #tick() {
    this.#snake.move();
  }

  #increaseSpeed() {
    clearInterval(this.#clockInterval);
    this.setCountApples(this.#countApples + 1);
    if (this.#countApples % 2 === 0) {
      this.#speed = this.#speed - 5;
    }
    this.#setClockInterval();
  }

  #setClockInterval() {
    this.#clockInterval = setInterval(() => this.#tick(), this.#speed);
  }
}

export const board = new Board(); // Singleton
