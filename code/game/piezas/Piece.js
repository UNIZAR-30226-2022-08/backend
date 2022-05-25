const WhitePlayer = true;
const BlackPlayer = false;

/**
 * @class Piece represents an abstract chess piece
 *
 */
class Piece {
	/**
	 *
	 * @param {Game} game initial board setup
	 * @param {number} xPos x position of the piece
	 * @param {number} yPos y position of the piece
	 */
	constructor(player, game, xPos, yPos, type) {
		this.pos = { x: xPos, y: yPos };
		this.player = player;
		this.game = game;
		this.type = type;
	}

	/**
	 * Get the allowed moves for the piece
	 * @returns array of allowed moves relative to the current position
	 */
	getAllowedMoves() {
		return [];
	}

	/**
	 *
	 * @param {number} x x position of the move
	 * @param {number} y y position of the move
	 * @returns true if the move is inside the board, false if not
	 */
	checkMoveRange(x, y) {
		return x >= 0 && x < 8 && y >= 0 && y < 8;
	}

	/**
	 * Move the piece x and y squares
	 * @param {number} xNew new x position
	 * @param {number} yNew new y position
	 * @returns true if the move was successful, false if not
	 */
	move(x, y) {
		console.log("LLamando move con x: ", x, " y:", y)
		console.log("Numeros:", Number(x), " y:", Number(y))
		const found2 = this.getAllowedMoves().find((elem) => {
			if (elem.x === Number(x) && elem.y === Number(y)) {
				console.log("Encontrado ", elem.x, elem.y)
				return true;
			}
			return false;
		});
		const found = true
		if (found) {
			this.pos.x = x;
			this.pos.y = y;
			return true;
		}
		return false;
	}
}

export default Piece;
export { WhitePlayer, BlackPlayer };
