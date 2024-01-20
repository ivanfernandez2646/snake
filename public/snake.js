import {
  SNAKE_HEAD_COLOR,
  PIECE_SIZE,
  SNAKE_BODY_COLOR,
  BOARD_SIZE,
} from "./constants.js";
import { board } from "./board.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

export class Snake {
  #direction;
  #pieces;

  constructor({ x, y }) {
    this.#direction = "right";
    this.#pieces = [
      new SnakePiece({
        x,
        y,
        isHead: true,
      }),
    ];
  }

  // Getters
  getPieces() {
    return this.#pieces.map((piece) => piece.clone());
  }

  // Setters
  setDirection(direction) {
    this.#direction = direction;
  }

  // Public methods
  move() {
    this.#checkMovement();
    this.#pieces?.map((piece, index, arr) => {
      ctx.clearRect(piece.getX(), piece.getY(), PIECE_SIZE, PIECE_SIZE);
      piece.move(
        this.#direction,
        index === arr.length - 1 ? arr[index - 1] : arr[index + 1]
      );
    });
    this.draw();
  }

  draw() {
    this.#pieces?.map((part) => part.draw());
  }

  reset() {
    this.#pieces = [];
  }

  // Private methods
  #checkMovement() {
    const frozenPieces = this.getPieces(),
      head = frozenPieces.find((piece) => piece.getIsHead()),
      prevHead = frozenPieces[frozenPieces.length - 2],
      apple = board.getApple(),
      newTmpHeadX =
        this.#direction === "right"
          ? head.getX() + PIECE_SIZE
          : this.#direction === "left"
            ? head.getX() - PIECE_SIZE
            : head.getX(),
      newTmpHeadY =
        this.#direction === "up"
          ? head.getY() - PIECE_SIZE
          : this.#direction === "down"
            ? head.getY() + PIECE_SIZE
            : head.getY(),
      headNextMovementPiece = new SnakePiece({
        x: newTmpHeadX,
        y: newTmpHeadY,
      });

    this.#handleDirection(prevHead, headNextMovementPiece);
    this.#checkCollision(frozenPieces, headNextMovementPiece);

    if (this.#direction === "right" || this.#direction === "left") {
      if (newTmpHeadX === apple.getX() && head.getY() === apple.getY()) {
        this.#pieces.unshift(
          new SnakePiece({ x: newTmpHeadX, y: apple.getY() })
        );
        board.generateNewApple();
      }
    } else if (this.#direction === "up" || this.#direction === "down") {
      if (head.getX() === apple.getX() && newTmpHeadY === apple.getY()) {
        this.#pieces.unshift(
          new SnakePiece({ x: apple.getX(), y: newTmpHeadY })
        );
        board.generateNewApple();
      }
    }
  }

  #handleDirection(prevHead, headNextMovementPiece) {
    if (!prevHead) {
      return;
    }

    if (!prevHead.isCollision(headNextMovementPiece)) {
      return;
    }

    if (this.#direction === "left") {
      this.#direction = "right";
      return;
    } else if (this.#direction === "right") {
      this.#direction = "left";
      return;
    } else if (this.#direction === "up") {
      this.#direction = "down";
      return;
    } else if (this.#direction === "down") {
      this.#direction = "up";
      return;
    }
  }

  #checkCollision(frozenPieces, headNextMovementPiece) {
    for (const piece of frozenPieces.slice(0, -2)) {
      if (piece.isCollision(headNextMovementPiece)) {
        board.reset();
        break;
      }
    }
  }
}

export class SnakePiece {
  #x;
  #y;
  #isHead;

  constructor({ x, y, isHead }) {
    this.#x = x;
    this.#y = y;
    this.#isHead = isHead ?? false;
  }

  // Getters
  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getIsHead() {
    return this.#isHead;
  }

  // Public methods
  isCollision(otherPiece) {
    return this.#x === otherPiece.getX() && this.#y === otherPiece.getY();
  }

  move(direction, prev) {
    if (this.#isHead) {
      if (direction === "right") {
        if (this.#x + PIECE_SIZE >= BOARD_SIZE) {
          this.#x = 0;
        } else {
          this.#x += PIECE_SIZE;
        }
      } else if (direction === "down") {
        if (this.#y + PIECE_SIZE >= BOARD_SIZE) {
          this.#y = 0;
        } else {
          this.#y += PIECE_SIZE;
        }
      } else if (direction === "up") {
        if (this.#y - PIECE_SIZE < 0) {
          this.#y = BOARD_SIZE - PIECE_SIZE;
        } else {
          this.#y -= PIECE_SIZE;
        }
      } else if (direction === "left") {
        if (this.#x - PIECE_SIZE < 0) {
          this.#x = BOARD_SIZE - PIECE_SIZE;
        } else {
          this.#x -= PIECE_SIZE;
        }
      }
    } else {
      if (!prev) {
        return;
      }

      this.#x = prev.#x;
      this.#y = prev.#y;
    }
  }

  clone() {
    const clonedObject = new SnakePiece({
      x: this.#x,
      y: this.#y,
      isHead: this.#isHead,
    });
    return clonedObject;
  }

  draw() {
    ctx.fillStyle = this.#isHead ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
    ctx.fillRect(this.#x, this.#y, PIECE_SIZE, PIECE_SIZE);
  }
}
