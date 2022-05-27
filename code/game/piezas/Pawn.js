import Piece, { BlackPlayer, WhitePlayer } from "./Piece";

class Pawn extends Piece {
	constructor(player, game, xPos = 1, yPos = 1) {
		super(player, game, xPos, yPos, "pawn");
	}

	getAllowedMoves() {
		const possibleMoves = [];
		const allowedMoves = [];

		possibleMoves.push({
			x: this.pos.x,
			y: this.pos.y + (this.player === WhitePlayer ? 1 : -1),
		});

		if (
			(this.pos.y === 1 && this.player === WhitePlayer) ||
			(this.pos.y === 6 && this.player === BlackPlayer)
		) {
			possibleMoves.push({
				x: this.pos.x,
				y: this.pos.y + (this.player === WhitePlayer ? 2 : -2),
			});
		}

		if (this.player === WhitePlayer) {
			if (this.game.getPiece(BlackPlayer, -1, 1)) {
				possibleMoves.push({ x: 1, y: -1 });
			}
			if (this.game.getPiece(BlackPlayer, 1, 1)) {
				possibleMoves.push({ x: 1, y: -1 });
			}
		} else {
			if (this.game.getPiece(WhitePlayer, -1, -1)) {
				possibleMoves.push({ x: 1, y: 1 });
			}
			if (this.game.getPiece(WhitePlayer, 1, -1)) {
				possibleMoves.push({ x: 1, y: 1 });
			}
		}

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

export default Pawn;
