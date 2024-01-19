import { APPLE_COLOR, PIECE_SIZE } from "./constants.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

export class Apple {
  #x;
  #y;

  constructor({ x, y }) {
    this.#x = x;
    this.#y = y;
  }

  // Getters
  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  // Public methods
  draw() {
    ctx.fillStyle = APPLE_COLOR;
    ctx.fillRect(this.#x, this.#y, PIECE_SIZE, PIECE_SIZE);
  }
}
