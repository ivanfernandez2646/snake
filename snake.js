import {
  SNAKE_HEAD_COLOR,
  PIECE_SIZE,
  SNAKE_BODY_COLOR,
  BOARD_SIZE,
} from "./constants.js";
import { deepClone } from "./deepClone.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

export class Snake {
  constructor({ x, y, board }) {
    this.board = board;
    this.direction = "right";
    this.body = [
      new SnakePiece({
        x,
        y,
        isHead: true,
      }),
    ];

    this.checkMovement = function () {
      const frozenPieces = deepClone(this.body),
        head = frozenPieces.find((piece) => piece.isHead),
        prevHead = frozenPieces[frozenPieces.length - 2],
        apple = this.board.apple,
        newTmpHeadX =
          this.direction === "right"
            ? head.x + PIECE_SIZE
            : this.direction === "left"
            ? head.x - PIECE_SIZE
            : head.x,
        newTmpHeadY =
          this.direction === "up"
            ? head.y - PIECE_SIZE
            : this.direction === "down"
            ? head.y + PIECE_SIZE
            : head.y;

      this.reviewDirection(prevHead, {
        ...head,
        x: newTmpHeadX,
        y: newTmpHeadY,
      });

      this.checkCollision(
        { ...head, x: newTmpHeadX, y: newTmpHeadY },
        frozenPieces
      );

      if (this.direction === "right" || this.direction === "left") {
        if (newTmpHeadX === apple.x && head.y === apple.y) {
          this.body.unshift(new SnakePiece({ x: newTmpHeadX, y: apple.y }));
          this.board.generateNewApple();
        }
      } else if (this.direction === "up" || this.direction === "down") {
        if (head.x === apple.x && newTmpHeadY === apple.y) {
          this.body.unshift(new SnakePiece({ x: apple.x, y: newTmpHeadY }));
          this.board.generateNewApple();
        }
      }
    };

    this.reviewDirection = function (prevHead, headTmpPosition) {
      if (!prevHead) {
        return;
      }

      if (!prevHead.isCollision(headTmpPosition)) {
        return;
      }

      if (this.direction === "left") {
        this.direction = "right";
        return;
      } else if (this.direction === "right") {
        this.direction = "left";
        return;
      } else if (this.direction === "up") {
        this.direction = "down";
        return;
      } else if (this.direction === "down") {
        this.direction = "up";
        return;
      }
    };

    this.checkCollision = function (headNextMovementPiece, frozenPieces) {
      if (
        headNextMovementPiece.x < 0 ||
        headNextMovementPiece.x >= BOARD_SIZE
      ) {
        this.board.reset();
        return;
      }

      if (
        headNextMovementPiece.y < 0 ||
        headNextMovementPiece.y >= BOARD_SIZE
      ) {
        this.board.reset();
        return;
      }

      for (const piece of frozenPieces.slice(0, -2)) {
        if (piece.isCollision(headNextMovementPiece)) {
          this.board.reset();
          break;
        }
      }
    };

    this.setDirection = function (newDirection) {
      this.direction = newDirection;
    };

    this.move = function () {
      this.checkMovement();
      this.body?.map((piece, index, arr) => {
        ctx.clearRect(piece.x, piece.y, PIECE_SIZE, PIECE_SIZE);
        piece.move(
          this.direction,
          index === arr.length - 1 ? arr[index - 1] : arr[index + 1]
        );
      });
      this.draw();
    };

    this.draw = function () {
      this.body?.map((part) => part.draw());
    };

    this.reset = function () {
      this.body = [];
    };
  }
}

class SnakePiece {
  constructor({ x, y, isHead }) {
    this.x = x;
    this.y = y;
    this.isHead = isHead ?? false;

    this.isCollision = function (otherPiece) {
      return this.x === otherPiece.x && this.y === otherPiece.y;
    };

    this.move = function (direction, prev) {
      if (this.isHead) {
        if (direction === "right") {
          this.x += PIECE_SIZE;
        } else if (direction === "down") {
          this.y += PIECE_SIZE;
        } else if (direction === "up") {
          this.y -= PIECE_SIZE;
        } else if (direction === "left") {
          this.x -= PIECE_SIZE;
        }
      } else {
        if (!prev) {
          return;
        }

        this.x = prev.x;
        this.y = prev.y;
      }
    };

    this.draw = function () {
      ctx.fillStyle = isHead ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
      ctx.fillRect(this.x, this.y, PIECE_SIZE, PIECE_SIZE);
    };
  }
}
