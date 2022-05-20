import Sequelize from "sequelize";
import Game from "../game/Game";
import GameModel from "../models/GameModel";

const matchmakingWaitingList = [];

const GameController = {
	async startMatchMaking(req, res) {},
	async startCasualGame(req, res) {
		if (!("otherPlayer" in req.body))
			res.status(400).json({ error: "Parametros incorrectos" }).send();

		let newGame = new Game(req.session.username, req.body.otherPlayer);

		return GameModel.create({
			board: JSON.stringify(newGame.board),
			whitePlayer: newGame.WhitePlayer,
			blackPlayer: newGame.BlackPlayer,
			turn: newGame.turn
		}).then(function(game) {
			res.status(200).json({ response: game }).send()
		}).catch(function(error) {
			res.status(400).json({ error }).send()
		})
			.then(function (game) {
				res.status(200).json({ response: game }).send();
			})
			.catch(function (error) {
				res.status(400).json({ error }).send();
			});
	},

	async getGame(req, res) {
		if (!containsParams(["gameId"], req)){
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return;
		}
		let { gameId } = req.body;

		GameModel.findByPk(gameId)
			.then(function (game) {
				if (!game) {
					res
						.status(400)
						.json({ error: "Couldn't find the game, ID is wrong" });
					res.send();
					return;
				}
				res.status(200).json({ response: game });
			})
			.catch(function (error) {
				res.status(400).json({ error }).send();
			});
	},

	async getActiveGames(req, res) {
		// No hace falta try/catch porque si no hay username el middleware devuelve 400 antes de llegar aqui
		const { username } = req.session;
		GameModel.findAll({
			where: Sequelize.and(
				Sequelize.or({ whitePlayer: username }, { blackPlayer: username }),
				{ inProgress: true }
			),
		})
		.catch(function(error) {
			res.status(400).json({ error }).send()
		})
	},

	move(req, res) {
		const { username } = req.session
		if (!containsParams(["gameId, x1, y1, x2, y2"], req)){
			res.status(400).json({ error: "Parametros incorrectos" }).send()
			return
		}
		let {gameId, x1, y1, x2, y2} = req.body
		GameModel.findByPk(gameId)
		.then(function(game) {
			if (!game) {
				res.status(400).json({ error:"Couldn't find the game, ID is wrong" }).send()
				return
			} else {
				if (game.blackPlayer != username && game.whitePlayer != username)
				{
					res.status(400).json({ error:"You aren't a player of that game" }).send()
					return
				} else if (game.blackPlayer == username && game.whiteTurn || !game.whiteTurn && game.whitePlayer != username)
				{
					res.status(400).json({ error:"It's not your turn" })
					res.send()
					return
				}
				var gameObj = new Game(game)
				var successful = gameObj.moveFromTo(game.whiteTurn, x1, y1, x2, y2)
				if (successful) {
					game.board = JSON.stringify(gameObj.board)
					game.update() //Sequelize call to update the saved model in the db
					res.status(200).json(game.board).send()
					return
				} else {
					res.status(400).json({ error:"You cannot make this move" }).send()
					return
				}
				
			}
		})
		.catch(function(error) {
			res.status(400).json({ error }).send()
		})
	},

	getMoves(req, res) {
		
	},
};

export default GameController;
