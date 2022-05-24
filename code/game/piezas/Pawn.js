import Piece, { BlackPlayer, WhitePlayer } from "./Piece";

class Pawn extends Piece {
	constructor(player, game, xPos = 1, yPos = 1) {
		super(player, game, xPos, yPos, "pawn");
	}

	getAllowedMoves() {
		const possibleMoves = [
		];
		const allowedMoves = [];

		possibleMoves.push({ x: 0, y: this.player === WhitePlayer ? 1 : -1 });
		
		if ((this.pos.y === 1 && this.player == WhitePlayer) || (this.pos.y === 6 && this.player == BlackPlayer)) {
			possibleMoves.push({ x: 0, y: this.player === WhitePlayer ? 2 : -2 });
		}

		if (this.player == WhitePlayer) {
			if (this.game.findPiece(BlackPlayer, this.x-1, this.y+1))
			{
				possibleMoves.push({ x: this.x-1, y: this.y+1 });
			}
			if (this.game.findPiece(BlackPlayer, this.x+1, this.y+1))
			{
				possibleMoves.push({ x: this.x+1, y: this.y+1 });
			}
		} else {
			if (this.game.findPiece(WhitePlayer, this.x-1, this.y-1))
			{
				possibleMoves.push({ x: this.x-1, y: this.y-1 });
			}
			if (this.game.findPiece(WhitePlayer, this.x+1, this.y-1))
			{
				possibleMoves.push({ x: this.x+1, y: this.y-1 });
			}
		}

		possibleMoves.forEach((elem) => {
			if (this.checkMoveRange(elem.x, elem.y)) allowedMoves.push(elem);
		});
		return allowedMoves;
	}
}

export default Pawn;
