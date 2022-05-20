import Bishop from "./piezas/Bishop";
import King from "./piezas/King";
import Knight from "./piezas/Knight";
import Pawn from "./piezas/Pawn";
import Queen from "./piezas/Queen";
import Rook from "./piezas/Rook";

const WhitePlayer = true;
const BlackPlayer = false;

function getInitialBoard(gameInst) {
	return {
		whitePieces: [
			// Pawns
			new Pawn(WhitePlayer, gameInst, 0, 1 ),
			new Pawn(WhitePlayer, gameInst, 1, 1 ),
			new Pawn(WhitePlayer, gameInst, 2, 1 ),
			new Pawn(WhitePlayer, gameInst, 3, 1 ),
			new Pawn(WhitePlayer, gameInst, 4, 1 ),
			new Pawn(WhitePlayer, gameInst, 5, 1 ),
			new Pawn(WhitePlayer, gameInst, 6, 1 ),
			new Pawn(WhitePlayer, gameInst, 7, 1 ),
			// Queen and king
			new King(WhitePlayer, gameInst, 3, 0 ),
			new Queen(WhitePlayer, gameInst, 4, 0 ),
			// Bishops
			new Bishop(WhitePlayer, gameInst, 2, 0 ),
			new Bishop(WhitePlayer, gameInst, 5, 0 ),
			// Knights
			new Knight(WhitePlayer, gameInst, 1, 0 ),
			new Knight(WhitePlayer, gameInst, 6, 0 ),
			// Rooks
			new Rook(WhitePlayer, gameInst, 0, 0 ),
			new Rook(WhitePlayer, gameInst, 7, 0 ),
		],
		blackPieces: [
			// Pawns
			new Pawn(BlackPlayer, gameInst, 0, 6 ),
			new Pawn(BlackPlayer, gameInst, 1, 6 ),
			new Pawn(BlackPlayer, gameInst, 2, 6 ),
			new Pawn(BlackPlayer, gameInst, 3, 6 ),
			new Pawn(BlackPlayer, gameInst, 4, 6 ),
			new Pawn(BlackPlayer, gameInst, 5, 6 ),
			new Pawn(BlackPlayer, gameInst, 6, 6 ),
			new Pawn(BlackPlayer, gameInst, 7, 6 ),
			// Queen and king
			new King(BlackPlayer, gameInst, 4, 6 ),
			new Queen(BlackPlayer, gameInst, 3, 6 ),
			// Bishops
			new Bishop(BlackPlayer, gameInst, 2, 6 ),
			new Bishop(BlackPlayer, gameInst, 5, 6 ),
			// Knights
			new Knight(BlackPlayer, gameInst, 1, 6 ),
			new Knight(BlackPlayer, gameInst, 6, 6 ),
			// Rooks
			new Rook(BlackPlayer, gameInst, 0, 6 ),
			new Rook(BlackPlayer, gameInst, 7, 6 ),
		],
	};
}

class Game {

	/**
	 * 
	 * @param {*} whitePlayerOrGame 
	 * @param {*} blackPlayer 
	 */
	constructor(whitePlayerOrGame, blackPlayer) {
		if (blackPlayer) {
			this.turn = WhitePlayer;
			this.whitePlayer = whitePlayerOrGame;
			this.blackPlayer = blackPlayer;
	
			this.board = getInitialBoard(this);
		} else {
			this.turn = whitePlayerOrGame.turn;
			this.whitePlayer = whitePlayerOrGame.whitePlayer;
			this.blackPlayer = whitePlayerOrGame.blackPlayer;
	
			this.board = JSON.parse(whitePlayerOrGame.board);
		}
	}

	/**
	 *
	 * @param {boolean} player player trying to move
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
