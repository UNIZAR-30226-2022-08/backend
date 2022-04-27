import { BlackPlayer, WhitePlayer } from "./piezas/Piece";
import Pawn from "./piezas/Pawn";
import Queen from "./piezas/Queen";

class Game {
	_ongoing = "ongoing"
	_complete = "complete"
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
		if (piece && piece.move(x2, y2)) {
			const taken = this.deletePiece(!player, piece.pos.x, piece.pos.y);
			if (taken) {
				// notificar pieza tomada
				console.log("eliminada pieza %s", taken.constructor.name);
			}
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
	 * @param {enum} player player for which to delete the piece
	 * @param {number} x x position of the piece
	 * @param {number} y x position of the piece
	 * @returns
	 */
	deletePiece(player, x, y) {
		let piece = null;

		function comparePiece(elem) {
			if (elem.pos.x !== x && elem.pos.y !== y) {
				return true;
			}
			piece = elem;
			return false;
		}

		if (player === WhitePlayer) {
			this.whitePieces = this.whitePieces.filter(comparePiece);
		} else {
			this.blackPieces = this.blackPieces.filter(comparePiece);
		}
		return piece;
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

	checkMate() {
		const king = this.whitePieces.find((elem) => {
			if (elem instanceof Queen) {
				return true;
			}
			return false;
		});
		if (!king) {
			return false;
		}

		return this.blackPieces
			.map((elem) => {
				let test = elem
					.getAllowedMoves()
					.concat(elem.pos)
					.map((move) =>
						king
							.getAllowedMoves()
							.concat(king.pos)
							.map((kingMove) => {
								if (
									elem.pos.x + move.x === king.pos.x + kingMove.x &&
									elem.pos.y + move.y === king.pos.y + kingMove.y
								) {
									return true;
								}
								return false;
							})
							.every((a) => a)
					);
				console.log(test);
				return test.every((res) => res);
			})
			.some((p) => p);
	}

	check() {
		const king = this.whitePieces.find((elem) => {
			if (elem instanceof Queen) {
				return true;
			}
			return false;
		});
		if (!king) {
			return false;
		}

		return this.blackPieces
			.map((elem) =>
				elem
					.getAllowedMoves()
					.concat(elem.pos)
					.map((move) =>
						king
							.getAllowedMoves()
							.concat(king.pos)
							.map((kingMove) => {
								if (
									elem.pos.x + move.x === king.pos.x + kingMove.x &&
									elem.pos.y + move.y === king.pos.y + kingMove.y
								) {
									return true;
								}
								return false;
							})
							.some((a) => a)
					)
					.some((res) => res)
			)
			.some((p) => p);
	}
}

export default Game;
