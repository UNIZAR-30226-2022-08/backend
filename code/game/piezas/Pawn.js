import Piece from "./Piece";

class Pawn extends Piece {
  constructor(board, xPos = 1, yPos = 1) {
    super(board, xPos, yPos);
  }

  getAllowedMoves() {
    const possibleMoves = [{ x: 0, y: 1 }];
    if (this.pos.x === 1) {
      possibleMoves.push({ x: 0, y: 2 });
    }

    const allowedMoves = [];

    possibleMoves.forEach((elem) => {
      if (this.checkMoveRange(elem.x, elem.y)) allowedMoves.push(elem);
    });

    return allowedMoves;
  }
}

export default Pawn;
