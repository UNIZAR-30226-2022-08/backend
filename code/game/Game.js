/* eslint-disable no-param-reassign */
import structuredClone from "@ungap/structured-clone";
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
			new Pawn(WhitePlayer, gameInst, 0, 1),
			new Pawn(WhitePlayer, gameInst, 1, 1),
			new Pawn(WhitePlayer, gameInst, 2, 1),
			new Pawn(WhitePlayer, gameInst, 3, 1),
			new Pawn(WhitePlayer, gameInst, 4, 1),
			new Pawn(WhitePlayer, gameInst, 5, 1),
			new Pawn(WhitePlayer, gameInst, 6, 1),
			new Pawn(WhitePlayer, gameInst, 7, 1),
			// Queen and king
			new Queen(WhitePlayer, gameInst, 3, 0),
			new King(WhitePlayer, gameInst, 4, 0),
			// Bishops
			new Bishop(WhitePlayer, gameInst, 2, 0),
			new Bishop(WhitePlayer, gameInst, 5, 0),
			// Knights
			new Knight(WhitePlayer, gameInst, 1, 0),
			new Knight(WhitePlayer, gameInst, 6, 0),
			// Rooks
			new Rook(WhitePlayer, gameInst, 0, 0),
			new Rook(WhitePlayer, gameInst, 7, 0),
		],
		blackPieces: [
			// Pawns
			new Pawn(BlackPlayer, gameInst, 0, 6),
			new Pawn(BlackPlayer, gameInst, 1, 6),
			new Pawn(BlackPlayer, gameInst, 2, 6),
			new Pawn(BlackPlayer, gameInst, 3, 6),
			new Pawn(BlackPlayer, gameInst, 4, 6),
			new Pawn(BlackPlayer, gameInst, 5, 6),
			new Pawn(BlackPlayer, gameInst, 6, 6),
			new Pawn(BlackPlayer, gameInst, 7, 6),
			// Queen and king
			new Queen(BlackPlayer, gameInst, 3, 7),
			new King(BlackPlayer, gameInst, 4, 7),
			// Bishops
			new Bishop(BlackPlayer, gameInst, 2, 7),
			new Bishop(BlackPlayer, gameInst, 5, 7),
			// Knights
			new Knight(BlackPlayer, gameInst, 1, 7),
			new Knight(BlackPlayer, gameInst, 6, 7),
			// Rooks
			new Rook(BlackPlayer, gameInst, 0, 7),
			new Rook(BlackPlayer, gameInst, 7, 7),
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
			console.log("Llamando constructor de partido nuevo");
			this.turn = WhitePlayer;
			this.whitePlayer = whitePlayerOrGame;
			this.blackPlayer = blackPlayer;

			this.board = getInitialBoard(this);
		} else {
			this.turn = whitePlayerOrGame.turn;
			this.whitePlayer = whitePlayerOrGame.whitePlayer;
			this.blackPlayer = whitePlayerOrGame.blackPlayer;
			this.board = this.JSONStringToBoard(whitePlayerOrGame.boardState);
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
		console.log("pieza:  ", piece);
		if (!piece) return false;
		const result = piece.move(Number(x2), Number(y2));
		console.log("movePiece devuelve ", result);
		if (result) {
			const taken = this.deletePiece(!player, x2, y2);
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
		let pieces = this.board.blackPieces;
		if (player === WhitePlayer) {
			pieces = this.board.whitePieces;
		}
		return pieces.find((elem) => {
			if (elem.pos.x === x && elem.pos.y === y) {
				return true;
			}
			return false;
		});
	}

	/**
	 *
	 * @param {boolean} player player for which to delete the piece
	 * @param {string} type type of piece to add
	 * @param {number} x x position of the piece
	 * @param {number} y x position of the piece
	 */
	addPiece(player, type, x, y) {
		let arr;
		if (player === WhitePlayer) arr = this.board.whitePieces;
		else arr = this.board.blackPieces;
		switch (type.toLowerCase()) {
			case "pawn":
				arr.push(new Pawn(player, this, Number(x), Number(y)));
				break;
			case "knight":
				arr.push(new Knight(player, this, Number(x), Number(y)));
				break;
			case "queen":
				arr.push(new Queen(player, this, Number(x), Number(y)));
				break;
			case "rook":
				arr.push(new Rook(player, this, Number(x), Number(y)));
				break;
			case "bishop":
				arr.push(new Bishop(player, this, Number(x), Number(y)));
				break;
			default:
				break;
		}
	}

	/**
	 *
	 * @param {boolean} player player for which to delete the piece
	 * @param {number} x x position of the piece
	 * @param {number} y x position of the piece
	 * @returns
	 */
	deletePiece(player, x, y) {
		function comparePiece(elem) {
			if (elem.pos.x !== x || elem.pos.y !== y) {
				return true;
			}
			return false;
		}

		if (player === WhitePlayer) {
			this.board.whitePieces = this.board.whitePieces.filter(comparePiece);
		} else {
			this.board.blackPieces = this.board.blackPieces.filter(comparePiece);
		}
	}

	/**
	 *
	 */
	getAllPieces(player) {
		if (player === WhitePlayer) {
			return this.board.whitePieces;
		}
		return this.board.blackPieces;
	}

	checkMate() {
		const king = this.getAllPieces(this.turn).find(
			(elem) => elem instanceof King
		);
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
		const king = this.getAllPieces(this.turn).find(
			(piece) => piece instanceof King
		);
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

	boardToJSONString() {
		const clone = structuredClone(this.board);
		clone.whitePieces.forEach((el) => {
			delete el.game;
		});
		clone.blackPieces.forEach((el) => {
			delete el.game;
		});
		return JSON.stringify(clone);
	}

	JSONStringToBoard(str) {
		let parsed;
		try {
			parsed = JSON.parse(str);
		} catch (error) {
			console.log(error);
		}
		const toRet = { whitePieces: [], blackPieces: [] };
		parsed.whitePieces.forEach((el) => {
			// eslint-disable-next-line default-case
			switch (el.type) {
				case "pawn":
					toRet.whitePieces.push(
						new Pawn(WhitePlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "rook":
					toRet.whitePieces.push(
						new Rook(WhitePlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "king":
					toRet.whitePieces.push(
						new King(WhitePlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "queen":
					toRet.whitePieces.push(
						new Queen(WhitePlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "bishop":
					toRet.whitePieces.push(
						new Bishop(WhitePlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "knight":
					toRet.whitePieces.push(
						new Knight(WhitePlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
			}
		});
		parsed.blackPieces.forEach((el) => {
			// eslint-disable-next-line default-case
			switch (el.type) {
				case "pawn":
					toRet.blackPieces.push(
						new Pawn(BlackPlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "rook":
					toRet.blackPieces.push(
						new Rook(BlackPlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "king":
					toRet.blackPieces.push(
						new King(BlackPlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "queen":
					toRet.blackPieces.push(
						new Queen(BlackPlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "bishop":
					toRet.blackPieces.push(
						new Bishop(BlackPlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
				case "knight":
					toRet.blackPieces.push(
						new Knight(BlackPlayer, this, Number(el.pos.x), Number(el.pos.y))
					);
					break;
			}
		});
		return toRet;
	}

	getAllowedMoves(player) {
		if (player === WhitePlayer) {
			return this.board.whitePieces.map((elem) => ({
				piece: {
					type: elem.type,
					player: elem.player,
					x: elem.pos.x,
					y: elem.pos.y,
				},
				moves: elem.getAllowedMoves(),
			}));
		}
		return this.board.blackPieces.map((elem) => ({
			piece: {
				type: elem.type,
				player: elem.player,
				x: elem.pos.x,
				y: elem.pos.y,
			},
			moves: elem.getAllowedMoves(),
		}));
	}
}

export { getInitialBoard, WhitePlayer, BlackPlayer };
export default Game;
