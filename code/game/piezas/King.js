import Piece from "./Piece";

class King extends Piece {
	constructor(player, game, xPos = 3, yPos = 3) {
		super(player, game, xPos, yPos, "king");
	}

	getAllowedMoves() {
		const possibleMoves = [
			{ x: 1, y: 1 },
			{ x: 1, y: -1 },
			{ x: -1, y: 1 },
			{ x: -1, y: -1 },
			{ x: 1, y: 0 },
			{ x: -1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -1 },
		];

		const allowedMoves = [];

		possibleMoves.forEach((elem) => {
			if (
				this.checkMoveRange(elem.x, elem.y) &&
				!this.game.getPiece(
					this.player,
					this.pos.x + elem.x,
					this.pos.y + elem.y
				)
			)
				allowedMoves.push(elem);
		});

		return allowedMoves;
	}
}

export default King;
