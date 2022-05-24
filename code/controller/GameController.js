/* eslint-disable no-useless-return */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import Sequelize from "sequelize";
import Game, { BlackPlayer, WhitePlayer } from "../game/Game";
import King from "../game/piezas/King";
import Rook from "../game/piezas/Rook";
import GameModel from "../models/GameModel";
import { containsParams } from "../util/util";

const matchmakingWaitingList = [];

const GameController = {
	async startMatchMaking(req, res) {},
	async startAsyncGame(req, res) {
		if (!containsParams(["whitePlayer", "blackPlayer"], req)) {
			console.log(req.body);
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return;
		}
		const newGame = new Game(req.body.whitePlayer, req.body.blackPlayer);
		return GameModel.create({
			boardState: newGame.boardToJSONString(),
			whitePlayer: newGame.whitePlayer,
			blackPlayer: newGame.blackPlayer,
			turn: newGame.turn,
			whiteWon: null,
			inProgress: true,
			isAsync: true,
		})
			.then(function (game) {
				game.boardState = JSON.parse(game.boardState);
				res.status(200).json({ response: game.dataValues }).send();
				return;
			})
			.catch(function (error) {
				console.log(error);
				res.status(400).json(error).send();
				return;
			});
	},

	async getGame(req, res) {
		if (!containsParams(["gameId"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return;
		}
		const { gameId } = req.body;

		GameModel.findByPk(gameId)
			.then(function (game) {
				if (!game) {
					res
						.status(400)
						.json({ error: "Couldn't find the game, ID is wrong" })
						.send();
					return;
				}
				game.boardState = JSON.parse(game.boardState);
				res.status(200).json({ response: game.dataValues }).send();
				return;
			})
			.catch(function (error) {
				console.log(error);
				res.status(400).json(error).send();
				return;
			});
	},

	async getActiveGames(req, res) {
		// No hace falta try/catch porque si no hay username el middleware devuelve 400 antes de llegar aqui
		const { username } = req.session;
		return GameModel.findAll({
			where: Sequelize.and(
				Sequelize.or({ whitePlayer: username }, { blackPlayer: username }),
				{ inProgress: true }
			),
		})
			.then(function (games) {
				res.status(200).json({ response: games }).send();
				return;
			})
			.catch(function (error) {
				console.log(error);
				res.status(400).json(error).send();
				return;
			});
	},

	move(req, res) {
		const { username } = req.session;
		if (!containsParams(["gameId", "x1", "y1", "x2", "y2"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return;
		}
		const { gameId, x1, y1, x2, y2 } = req.body;
		return GameModel.findByPk(gameId)
			.then(function (game) {
				if (!game) {
					res
						.status(400)
						.json({ error: "Couldn't find the game, ID is wrong" })
						.send();
				} else {
					if (game.blackPlayer !== username && game.whitePlayer !== username) {
						res
							.status(400)
							.json({ error: "You aren't a player of that game" })
							.send();
					}
					if (
						(game.blackPlayer === username && game.whiteTurn) ||
						(!game.whiteTurn && game.whitePlayer !== username)
					) {
						res.status(400).json({ error: "It's not your turn" }).send();
					}
					// Es el turno del usuario, ahora comprobamos que el movimiento sea valido
					const gameObj = new Game(game.dataValues);
					console.log("Successfully created game object");
					const successful = gameObj.moveFromTo(game.whiteTurn, x1, y1, x2, y2);
					if (successful) {
						game.board = gameObj.boardToJSONString();
						game.whiteTurn = !game.whiteTurn;
						game.update(); // Sequelize call to update the saved model in the db
						res.status(200).json(game.board).send();
					} else {
						res.status(400).json({ error: "You cannot make this move" }).send();
					}
				}
			})
			.catch(function (error) {
				console.log(error);
				res.status(400).json(error).send();
			});
	},

	promotePawn(req, res) {
		if (!containsParams(["x", "y", "wantedPiece"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return;
		}
		const { x, y, wantedPiece, gameId } = req.body;
		let player;
		return GameModel.findByPk(gameId)
			.then(function (game) {
				const curGame = new Game(game);
				if (curGame.whitePlayer === req.session.username) {
					player = WhitePlayer;
					if (y !== 7) {
						res
							.status(400)
							.json({ error: "You can't promote that piece" })
							.send();
						return;
					}
				} else {
					player = BlackPlayer;
					if (y !== 0) {
						res
							.status(400)
							.json({ error: "You can't promote that piece" })
							.send();
						return;
					}
				}
				curGame.deletePiece(player, x, y);
				curGame.addPiece(player, wantedPiece, x, y);
			})
			.catch(function (error) {
				console.log(error);
				res.status(400).json(error).send();
			});
	},

	castle(req, res) {
		if (!containsParams(["gameId", "side"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return;
		}

		const { username } = req.session;
		const { gameId, side } = req.body;

		GameModel.findByPk(gameId).then(function (game) {
			const curGame = new Game(game);
			if (
				(game.blackPlayer === username && game.whiteTurn) ||
				(!game.whiteTurn && game.whitePlayer !== username)
			) {
				res.status(400).json({ error: "It's not your turn" }).send();
			}

			let y;
			if (curGame.whiteTurn) {
				y = 0;
			} else {
				y = 7;
			}

			if (side === "left") {
				if (
					curGame.getPiece(curGame.whiteTurn, 4, y) instanceof King &&
					curGame.getPiece(curGame.whiteTurn, 0, y) instanceof Rook &&
					!curGame.getPiece(curGame.whiteTurn, 1, y) &&
					!curGame.getPiece(curGame.whiteTurn, 2, y) &&
					!curGame.getPiece(curGame.whiteTurn, 3, y)
				) {
					// enrocar
				}
			} else if (side === "right") {
				if (
					curGame.getPiece(curGame.whiteTurn, 4, y) instanceof King &&
					curGame.getPiece(curGame.whiteTurn, 7, y) instanceof Rook &&
					!curGame.getPiece(curGame.whiteTurn, 5, y) &&
					!curGame.getPiece(curGame.whiteTurn, 6, y)
				) {
					// enrocar
				}
			}
		});
	},

	getMoves(req, res) {},
};

export default GameController;
