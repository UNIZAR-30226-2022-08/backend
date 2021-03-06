import Piece, { BlackPlayer } from "./Piece";

class Queen extends Piece {
	constructor(player, game, xPos = 1, yPos = 1) {
		super(player, game, xPos, yPos);
	}

	#walk(x, y, xMov, yMov) {
		const newX = x + xMov;
		const newY = y + yMov;

		let arr = [];
		if (this.checkMoveRange(this.pos.x + newX, this.pos.y + newY)) {
			arr.push({ x: newX, y: newY });
			if (!this.game.getPiece(!this.player, newX, newY)) {
				arr = arr.concat(this.#walk(newX, newY, xMov, yMov));
			}
		}
		return arr;
	}

	getAllowedMoves() {
		return this.#walk(0, 0, 1, 1)
			.concat(this.#walk(0, 0, -1, -1))
			.concat(this.#walk(0, 0, 1, -1))
			.concat(this.#walk(0, 0, -1, 1))
			.concat(this.#walk(0, 0, 1, 0))
			.concat(this.#walk(0, 0, -1, 0))
			.concat(this.#walk(0, 0, 0, 1))
			.concat(this.#walk(0, 0, 0, -1));
	}
}

export default Queen;
