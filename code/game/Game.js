import King from "./piezas/King";

const WhitePlayer = true;
const BlackPlayer = false;

function getInitialBoard() {
	return {
		whitePieces: [
			// Pawns
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 1, y: 3 },
			{ x: 1, y: 4 },
			{ x: 1, y: 5 },
			{ x: 1, y: 6 },
			{ x: 1, y: 7 },
			// Queen and king
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			// Bishops
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			// Rooks
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			// Knights
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
		],
		blackPieces: [
			// Pawns
			{ x: 6, y: 0 },
			{ x: 6, y: 1 },
			{ x: 6, y: 2 },
			{ x: 6, y: 3 },
			{ x: 6, y: 4 },
			{ x: 6, y: 5 },
			{ x: 6, y: 6 },
			{ x: 6, y: 7 },
			// Queen and king
			{ x: 7, y: 0 },
			{ x: 7, y: 0 },
			// Bishops
			{ x: 7, y: 0 },
			{ x: 7, y: 0 },
			// Rooks
			{ x: 7, y: 0 },
			{ x: 7, y: 0 },
			// Knights
			{ x: 7, y: 0 },
			{ x: 7, y: 0 },
		],
	};
}

class Game {
	_ongoing = "ongoing";

	_complete = "complete";

	constructor(whitePlayer, blackPlayer) {
		this.turn = WhitePlayer;
		this.whitePlayer = whitePlayer;
		this.blackPlayer = blackPlayer;

		this.board = getInitialBoard();
	}

	constructor(game) {
		this.turn = game.turn;
		this.whitePlayer = game.whitePlayer;
		this.blackPlayer = game.blackPlayer;

		this.board = game.board;
	}

	/**
	 *
	 * @param {enum} player player trying to move
	 * @param {number} x1 Current x position of the piece
	 * @param {number} y1 Current y position of the piece
	 * @param {number} x2 Wished x position of the piece
	 * @param {number} y2 Wished y position of the piece
	 * @returns {boolean} If the move was possible
	 */
	moveFromTo(player, x1, y1, x2, y2) {
		const piece = this.getPiece(player, x1, y1);
		if (piece && piece.move(x2, y2)) {
			const taken = this.deletePiece(!player, piece.pos.x, piece.pos.y);
			if (taken) {
				// notificar pieza tomada
				console.log("eliminada pieza %s", taken.constructor.name);
			}
			return true;
		}
		return false;
	}

	/**
	 *
	 * @param {enum} player player trying to move
	 * @param {number} x x position of the piece
	 * @param {number} y y position of the piece
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
		const king = this.whitePieces.find((elem) => elem instanceof King);
		if (!king) {
			return false;
		}

		return this.blackPieces
			.map((piece) =>
				piece
					.getAllowedMoves()
					.concat(piece.pos)
					.map((move) =>
						king
							.getAllowedMoves()
							.concat(king.pos)
							.map((kingMove) => {
								if (
									piece.pos.x + move.x === king.pos.x + kingMove.x &&
									piece.pos.y + move.y === king.pos.y + kingMove.y
								) {
									return true;
								}
								return false;
							})
							.every((a) => a)
					)
					.every((res) => res)
			)
			.some((p) => p);
	}

	check() {
		const king = this.whitePieces.find((piece) => piece instanceof King);
		if (!king) {
			return false;
		}

		return this.blackPieces
			.map((piece) =>
				piece
					.getAllowedMoves()
					.concat(piece.pos)
					.map((move) =>
						king
							.getAllowedMoves()
							.concat(king.pos)
							.map((kingMove) => {
								if (
									piece.pos.x + move.x === king.pos.x + kingMove.x &&
									piece.pos.y + move.y === king.pos.y + kingMove.y
								) {
									return true;
								}
								return false;
							})
							.some((res) => res)
					)
					.some((res) => res)
			)
			.some((res) => res);
	}
}

export { getInitialBoard, WhitePlayer, BlackPlayer };
export default Game;
