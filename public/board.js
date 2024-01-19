import {
  BOARD_SIZE,
  PIECE_SIZE,
  SPEED_INTERVAL,
  SPEED_INCREMENTATOR,
} from "./constants.js";
import { Apple } from "./apple.js";
import { Snake, SnakePiece } from "./snake.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

class Board {
  #snake;
  #clockInterval;
  #speed;
  #apple;
  #countApples;
  #availablePositionsForNewApple;

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

  // Setters
  setSnakeDirection(direction) {
    this.#snake.setDirection(direction);
  }

  // Public methods
  start() {
    this.#snake = new Snake({ x: 0, y: 0, board: this });
    this.#apple = new Apple({ x: 20, y: 20 });
    this.#snake.draw();
    this.#apple.draw();

    this.#clockInterval = setInterval(() => {
      this.#tick();
    }, this.#speed);
  }

  reset() {
    new Howl({
      preload: true,
      src: [`./assets/crash${Math.floor(Math.random() * (2 - 1 + 1) + 1)}.m4a`],
    }).play();
    this.#snake.reset();
    this.#countApples = 0;
    this.#speed = SPEED_INTERVAL;
    clearInterval(this.#clockInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
      alert("END GAME");
    }, 50);
    this.start();
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

  // Private methods
  #tick() {
    this.#snake.move();
  }

  #increaseSpeed() {
    clearInterval(this.#clockInterval);
    this.#clockInterval = setInterval(
      () => this.#tick(),
      this.#speed - (this.#countApples * 20 + SPEED_INCREMENTATOR)
    );
  }
}

export const board = new Board(); // Singleton
