import Game, { getInitialBoard } from "../game/Game";
import AsyncGame from "../models/AsyncGame";

const GameController = {
	createAsyncGame(req, res) {
		const {username} = req.session
		const {otherPlayer, startingSide} = req.body;
		let newGame = new Game(username, "", getInitialBoard(), WhitePlayer);
		//TODO mirar este metodo..
		AsyncGame.create({
			board: JSON.stringify(newGame.board),
			whitePlayer: newGame.WhitePlayer,
			blackPlayer: newGame.BlackPlayer,
			turn: newGame.turn,
		});
	},

	getGame(req, res) {
		const {gameId} = req.body
		let game = AsyncGame.findByPk(gameId)
		if (game === null) {
			res.status(400).json({ error:"Couldn't find the game"})
			res.send()
			return
		}
		let newGame = {
			gameId: game.gameId,
			whitePlayer: game.whitePlayer,
			blackPlayer: game.blackPlayer,
			//TODO aqui devolvemos las piezas?
			//...porque creamos nuevo si ya tenemos game?
		};
		res.status(200).json({ response: game})
	},

	getActiveGames(req, res) {
		const {username } = req.session
		let game = AsyncGame.find({ 
			where: { 
				inProgress: true,
				[Op.or]: [{ whitePlayer: username }, { blackPlayer: username }],
			}
		})
		if (game === null) {
			res.status(200).json({ response: {}, message: "No active games found"})
		}
	},

	move(req, res) {

	},

	getMoves(req, res) {

	},
};

export default GameController;
