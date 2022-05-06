import Sequelize from "sequelize";
import Game from "../game/Game";
import GameModel from "../models/GameModel";


const GameController = {
	async createAsyncGame(req, res) {
		let whitePlayer, blackPlayer
		try {
			let {whitePlayer, blackPlayer} = req.body
		} catch (error) {
			res.status(400).json({ error: "Parametros incorrectos" }).send()
		}
		let newGame = new Game(whitePlayer, blackPlayer);
		
		var game = GameModel.create({
			board: JSON.stringify(newGame.board),
			whitePlayer: newGame.WhitePlayer,
			blackPlayer: newGame.BlackPlayer,
			turn: newGame.turn,
		}).then(function(game) {
			res.status(200).json({ response: game }).send()
		}).error(function(error) {
			res.status(400).json({ error }).send()
		})
	},

	async getGame(req, res) {
		let gameId
		try {
			let {gameId} = req.body
		} catch (error) {
			res.status(400).json({ error: "Parametros incorrectos" }).send()
		}
		GameModel.findByPk(gameId)
		.then(function(game) {
			if (game === null) {
				res.status(400).json({ error:"Couldn't find the game, ID is wrong" })
				res.send()
				return
			}
			res.status(200).json({ response: game })
		})
		.error(function(error) {
			res.status(400).json({ error }).send()
		})
	},

	async getActiveGames(req, res) {
		//No hace falta try/catch porque si no hay username el middleware devuelve 400 antes de llegar aqui
		const { username } = req.session
		GameModel.findAll({ 
			where: Sequelize.and(Sequelize.or({ whitePlayer: username }, { blackPlayer: username }), {inProgress : true} )
		}).then(function(games) {
			if (games === null) {
				res.status(200).json({ response: {}, message: "No active games found"}).send()
			}
			res.status(200).json({ response: games }).send()
		})
		.catch(function(error) {
			res.status(400).json({ error }).send()
		})


	},

	move(req, res) {
		
	},

	getMoves(req, res) {

	},
};

export default GameController;
