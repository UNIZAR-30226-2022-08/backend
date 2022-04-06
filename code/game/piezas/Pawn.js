import Piece, { WhitePlayer } from "./Piece";

class Pawn extends Piece {
	constructor(player, xPos = 1, yPos = 1) {
		super(player, xPos, yPos);
	}

	getAllowedMoves() {
		const possibleMoves = [];
		const allowedMoves = [];

		if (this.player === WhitePlayer) {
			possibleMoves.push({ x: 0, y: 1 });

			if (this.pos.y === 1) {
				possibleMoves.push({ x: 0, y: 2 });
			}
		} else {
			possibleMoves.push({ x: 0, y: -1 });

			if (this.pos.y === 6) {
				possibleMoves.push({ x: 0, y: -2 });
			}
		}

		possibleMoves.forEach((elem) => {
			if (this.checkMoveRange(elem.x, elem.y)) allowedMoves.push(elem);
		});

		return allowedMoves;
	}
}

export default Pawn;
