import Piece, { WhitePlayer } from "./Piece";

class Pawn extends Piece {
	constructor(player, game, xPos = 1, yPos = 1) {
		super(player, game, xPos, yPos);
	}

	getAllowedMoves() {
		const possibleMoves = [];
		const allowedMoves = [];

		possibleMoves.push({ x: 0, y: this.player === WhitePlayer ? 1 : -1 });
		if (this.pos.y === 1 || this.pos.y === 6) {
			possibleMoves.push({ x: 0, y: this.player === WhitePlayer ? 2 : -2 });
		}

		possibleMoves.forEach((elem) => {
			if (this.checkMoveRange(elem.x, elem.y)) allowedMoves.push(elem);
		});

		return allowedMoves;
	}
}

export default Pawn;
