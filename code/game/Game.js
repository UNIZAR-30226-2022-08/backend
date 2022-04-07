import Pawn from "./piezas/Pawn";
import { BlackPlayer, WhitePlayer } from "./piezas/Piece";
import Queen from "./piezas/Queen";

class Game {
	constructor() {
		this.turn = WhitePlayer;
		this.whitePieces = [];
		this.blackPieces = [];

		// Whites
		for (let i = 0; i < 7; i += 1) {
			this.whitePieces.push(new Pawn(WhitePlayer, i, 1));
		}
		this.whitePieces.push(new Queen(WhitePlayer, 3, 0));

		// Blacks
		for (let i = 0; i < 7; i += 1) {
			this.blackPieces.push(new Pawn(BlackPlayer, i, 6));
		}
		this.blackPieces.push(new Queen(BlackPlayer, 3, 7));
	}

	moveFromTo(player, x1, y1, x2, y2) {
		const piece = this.getPiece(player, x1, y1);
		if (piece) {
			return piece.move(x2, y2);
		}
		return false;
	}

	/**
	 *
	 * @param {enum} player player trying to move
	 * @param {number} x x position of the piece
	 * @param {number} y x position of the piece
	 * @returns
	 */
	getPiece(player, x, y) {
		let pieces = this.blackPieces;
		if (player === WhitePlayer) {
			pieces = this.whitePieces;
		}

		return pieces.find((elem) => {
			if (elem.pos.x === x && elem.pos.y === y) return true;
			return false;
		});
	}

	/**
	 *
	 */
	getAllPieces(player) {
		if (player === WhitePlayer) {
			return this.whitePieces;
		}
		return this.blackPieces;
	}

	/**
	 * Check if the given position is occupied by a piece
	 * @param {number} x x position to check
	 * @param {number} y y position to check
	 */
	occupied(x, y) {}
}

export default Game;
