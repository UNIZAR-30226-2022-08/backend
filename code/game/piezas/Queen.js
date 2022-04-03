import Piece from "./Piece";

class Queen extends Piece {
	constructor(player, xPos = 1, yPos = 1) {
		super(player, xPos, yPos);
	}
}

export default Queen;
