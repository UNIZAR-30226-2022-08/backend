import Piece from "./Piece";

class Queen extends Piece {
  constructor(board, xPos = 1, yPos = 1) {
    super(board, xPos, yPos);
  }
}

export default Queen;
