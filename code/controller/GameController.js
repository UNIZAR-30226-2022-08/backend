import Game, { getInitialBoard } from "../game/Game";
import AsyncGame from "../models/AsyncGame";

const GameController = {
	createGame(username) {
		let newGame = new Game(username, "", getInitialBoard(), WhitePlayer);
		AsyncGame.create({
			board: JSON.stringify(newGame.board),
			whitePlayer: newGame.WhitePlayer,
			blackPlayer: newGame.BlackPlayer,
			turn: newGame.turn,
		});
	},
	getGame(gameId) {
		let game = AsyncGame.findOne({ where: { gameId } });
		if (game === null) {
			return null;
		}

		let newGame = {
			gameId: game.gameId,
			whitePlayer: game.whitePlayer,
			blackPlayer: game.blackPlayer,
		};
		return game;
	},
};

export default GameController;
