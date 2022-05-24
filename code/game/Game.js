/* eslint-disable no-param-reassign */
import structuredClone from '@ungap/structured-clone'
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
			console.log("Llamando constructor de partido nuevo")
			this.turn = WhitePlayer;
			this.whitePlayer = whitePlayerOrGame;
			this.blackPlayer = blackPlayer;
	
			this.board = getInitialBoard(this);
		} else {
			this.turn = whitePlayerOrGame.turn;
			this.whitePlayer = whitePlayerOrGame.whitePlayer;
			this.blackPlayer = whitePlayerOrGame.blackPlayer;
			console.log("Instanciando partida de DB")
			const tempBoard = this.JSONStringToBoard(whitePlayerOrGame.boardState)
			
			console.log("Despues del parse: ", tempBoard)
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
	 * @param {boolean} player player for which to delete the piece
	 * @param {string} type type of piece to add
	 * @param {number} x x position of the piece
	 * @param {number} y x position of the piece
	 */
	addPiece(player, type, x, y) {
		let arr
		if (player === WhitePlayer)
			arr = this.whitePieces
		else
			arr = this.blackPieces
		switch(type.toLowerCase()) {
			case "pawn":
				arr.push(new Pawn(player, this, x, y))
				break;
			case "knight":
				arr.push(new Pawn(player, this, x, y))
				break;
			case "queen":
				arr.push(new Pawn(player, this, x, y))
				break;
			case "rook":
				arr.push(new Pawn(player, this, x, y))
				break;
			case "bishop":
				arr.push(new Pawn(player, this, x, y))
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

	boardToJSONString () {
		const clone = structuredClone(this.board)
		clone.whitePieces.forEach(el => {
			delete el.game
		});
		clone.blackPieces.forEach(el => {
			delete el.game
		});
		return JSON.stringify(clone)
	}

	JSONStringToBoard (str) {
		console.log("antes de parsed")
		let parsed
		try {
			parsed = JSON.parse(str)
		} catch (error) {
			console.log(error)
		}
		
		const toRet = { whitePieces : [], blackPieces : [] }
		parsed.whitePieces.forEach(el => {
			// eslint-disable-next-line default-case
			switch ( el.type ) {
				case "pawn" : 
					toRet.whitePieces.push(new Pawn(WhitePlayer, this, el.x.pos, el.y.pos))
					break;
				case "rook" : 
					toRet.whitePieces.push(new Rook(WhitePlayer, this, el.x.pos, el.y.pos))
					break;
				case "king" : 
					toRet.whitePieces.push(new King(WhitePlayer, this, el.x.pos, el.y.pos))
					break;
				case "queen" : 
					toRet.whitePieces.push(new Queen(WhitePlayer, this, el.x.pos, el.y.pos))
					break;
				case "bishop" : 
					toRet.whitePieces.push(new Bishop(WhitePlayer, this, el.x.pos, el.y.pos))
					break;
				case "knight" : 
					toRet.whitePieces.push(new Knight(WhitePlayer, this, el.pos.x, el.y.pos))
					break;
			}
		});
		toRet.blackPieces.forEach(el => {
			// eslint-disable-next-line default-case
			switch ( el.type ) {
				case "pawn" : 
					toRet.whitePieces.push(new Pawn(BlackPlayer, this, el.x.pos, el.y.pos))
					break;
				case "rook" : 
					toRet.whitePieces.push(new Rook(BlackPlayer, this, el.x.pos, el.y.pos))
					break;
				case "king" : 
					toRet.whitePieces.push(new King(BlackPlayer, this, el.x.pos, el.y.pos))
					break;
				case "queen" : 
					toRet.whitePieces.push(new Queen(BlackPlayer, this, el.x.pos, el.y.pos))
					break;
				case "bishop" : 
					toRet.whitePieces.push(new Bishop(BlackPlayer, this, el.x.pos, el.y.pos))
					break;
				case "knight" : 
					toRet.whitePieces.push(new Knight(BlackPlayer, this, el.x.pos, el.y.pos))
					break;
			}
		});
		return toRet
	}

}

export { getInitialBoard, WhitePlayer, BlackPlayer };
export default Game;
