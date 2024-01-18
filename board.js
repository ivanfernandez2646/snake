import { BOARD_SIZE, PIECE_SIZE, SPEED_INCREMENTATOR } from "./constants.js";
import { Apple } from "./apple.js";
import { Snake } from "./snake.js";
import { deepClone } from "./deepClone.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

export class Board {
  constructor() {
    this.snake = undefined;
    this.apple = undefined;
    this.clockInterval = undefined;
    this.countFood = 0;
    this.speed = 400; // milliseconds
    this.availableCoordsForApple = (() => {
      const res = [];
      let i = 0;
      do {
        res.push(i * PIECE_SIZE);
        i++;
      } while (res[res.length - 1] < BOARD_SIZE - PIECE_SIZE);
      return res;
    })();

    this.start = function () {
      this.snake = new Snake({ x: 0, y: 0, board: this });
      this.apple = new Apple({ x: 20, y: 20 });
      this.snake.draw();
      this.apple.draw();

      this.clockInterval = setInterval(() => {
        this.tick();
      }, this.speed);
    };

    this.reset = function () {
      this.snake.reset();
      this.countFood = 0;
      this.speed = 400;
      clearInterval(this.clockInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      alert("END GAME");
      this.start();
    };

    this.tick = function () {
      this.snake.move();
    };

    this.generateNewApple = function () {
      let x;
      let y;

      this.countFood += 1;
      this.increaseSpeed();

      const frozenPieces = deepClone(this.snake.body);
      do {
        x =
          this.availableCoordsForApple[
            Math.floor(Math.random() * this.availableCoordsForApple.length)
          ];
        y =
          this.availableCoordsForApple[
            Math.floor(Math.random() * this.availableCoordsForApple.length)
          ];
      } while (
        x % PIECE_SIZE !== 0 ||
        y % PIECE_SIZE !== 0 ||
        frozenPieces.some((piece) => piece.isCollision({ x, y }))
      );

      this.apple = new Apple({ x, y });
      this.apple.draw();
    };

    this.increaseSpeed = function () {
      clearInterval(this.clockInterval);
      this.clockInterval = setInterval(
        () => this.tick(),
        this.speed - (this.countFood * 5 + SPEED_INCREMENTATOR)
      );
    };
  }
}
