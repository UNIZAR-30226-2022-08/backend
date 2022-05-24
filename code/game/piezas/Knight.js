import Piece from "./Piece";

class Knight extends Piece {
	constructor(player, game, xPos = 1, yPos = 1) {
		super(player, game, xPos, yPos, "knight");
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
