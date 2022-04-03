import Piece from "./Piece";

class Knight extends Piece {
	constructor(board, xPos = 1, yPos = 1) {
		super(board, xPos, yPos);
	}

	getAllowedMoves() {
		const possibleMoves = [
			{ x: 2, y: 1 },
			{ x: 2, y: -1 },
			{ x: -2, y: 1 },
			{ x: -2, y: -1 },
			{ x: 1, y: 2 },
			{ x: -1, y: 2 },
			{ x: 1, y: 2 },
			{ x: -1, y: 2 },
		];

		const allowedMoves = [];

		possibleMoves.forEach((elem) => {
			if (this.checkMoveRange(elem.x, elem.y)) allowedMoves.push(elem);
		});

		return allowedMoves;
	}
}

export default Knight;
