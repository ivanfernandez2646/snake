import { APPLE_COLOR, PIECE_SIZE } from "./constants.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

export class Apple {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;

    this.draw = function () {
      ctx.fillStyle = APPLE_COLOR;
      ctx.fillRect(this.x, this.y, PIECE_SIZE, PIECE_SIZE);
    };
  }
}
