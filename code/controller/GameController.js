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
	async startMatchMaking(req, res, next) {},
	async startAsyncGame(req, res, next) {
		if (!containsParams(["whitePlayer", "blackPlayer"], req)) {
			console.log(req.body);
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const newGame = new Game(req.body.whitePlayer, req.body.blackPlayer);
		return GameModel.create({
			boardState: newGame.boardToJSONString(),
			whitePlayer: newGame.whitePlayer,
			blackPlayer: newGame.blackPlayer,
			turn: newGame.whiteTurn,
			whiteWon: null,
			inProgress: true,
			isAsync: true,
		})
			.then(function (game) {
				game.boardState = JSON.parse(game.boardState);
				res.status(200).json({ response: game.dataValues });
				return;
			})
			.catch(function (error) {
				console.trace();
				console.log(error);
				res.status(400).json(error);
				return;
			});
	},

	async getGame(req, res, next) {
		if (req.query.gameId === undefined) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { gameId } = req.query;

		GameModel.findByPk(gameId)
			.then(function (game) {
				if (!game) {
					res
						.status(400)
						.json({ error: "Couldn't find the game, ID is wrong" });
					return;
				}
				game.boardState = JSON.parse(game.boardState);
				res.status(200).json({ response: game.dataValues });
				return;
			})
			.catch(function (error) {
				console.trace();
				console.log(error);
				res.status(400).json(error);
				return;
			});
	},

	async getActiveGames(req, res, next) {
		// No hace falta try/catch porque si no hay username el middleware devuelve 400 antes de llegar aqui
		const { username } = req.session;
		return GameModel.findAll({
			where: Sequelize.and(
				Sequelize.or({ whitePlayer: username }, { blackPlayer: username }),
				{ inProgress: true }
			),
			attributes: {
				exclude: ["boardState"],
			},
		})
			.then(function (games) {
				res.status(200).json({ response: games });
				return;
			})
			.catch(function (error) {
				console.trace();
				console.log(error);
				res.status(400).json(error);
				return;
			});
	},

	move(req, res, next) {
		const { username } = req.session;
		if (!containsParams(["gameId", "x1", "y1", "x2", "y2"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { gameId, x1, y1, x2, y2 } = req.body;
		return GameModel.findByPk(gameId)
			.then(function (game) {
				if (!game) {
					res
						.status(400)
						.json({ error: "Couldn't find the game, ID is wrong" });
					return;
				}
				if (game.blackPlayer !== username && game.whitePlayer !== username) {
					res.status(400).json({ error: "You aren't a player of that game" });
				}
				if (
					(game.blackPlayer === username && game.turn) ||
					(!game.turn && game.whitePlayer !== username)
				) {
					res.status(400).json({ error: "It's not your turn" });
				}
				// Es el turno del usuario, ahora comprobamos que el movimiento sea valido
				const gameObj = new Game(game.dataValues);
				console.log("Successfully created game object");
				const successful = gameObj.moveFromTo(
					game.turn,
					Number(x1),
					Number(y1),
					Number(x2),
					Number(y2)
				);
				if (successful) {
					game.boardState = gameObj.boardToJSONString();
					game.turn = !game.turn;
					game.save(); // Sequelize call to update the saved model in the db
					res.status(200).json(JSON.parse(game.boardState));
				} else {
					res.status(400).json({ error: "You cannot make this move" });
				}
			})
			.catch(function (error) {
				console.trace();
				console.log(error);
				res.status(400).json(error);
			});
	},

	promotePawn(req, res, next) {
		if (!containsParams(["x", "y", "wantedPiece"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
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
						res.status(400).json({ error: "You can't promote that piece" });
						next();
						return;
					}
				} else {
					player = BlackPlayer;
					if (y !== 0) {
						res.status(400).json({ error: "You can't promote that piece" });
						return;
					}
				}
				curGame.deletePiece(player, x, y);
				curGame.addPiece(player, wantedPiece, x, y);
			})
			.catch(function (error) {
				console.trace();
				console.log(error);
				res.status(400).json(error);
			});
	},

	castle(req, res, next) {
		if (!containsParams(["gameId", "side"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}

		const { username } = req.session;
		const { gameId, side } = req.body;

		GameModel.findByPk(gameId).then(function (game) {
			const gameObj = new Game(game);
			if (
				(game.blackPlayer === username && game.whiteTurn) ||
				(!game.whiteTurn && game.whitePlayer !== username)
			) {
				res.status(400).json({ error: "It's not your turn" });
				return;
			}

			let y;
			if (gameObj.whiteTurn) {
				y = 0;
			} else {
				y = 7;
			}
			let successful = true
			if (side === "left") {
				if (
					gameObj.getPiece(gameObj.whiteTurn, 4, y) instanceof King &&
					gameObj.getPiece(gameObj.whiteTurn, 0, y) instanceof Rook &&
					!gameObj.getPiece(gameObj.whiteTurn, 1, y) &&
					!gameObj.getPiece(gameObj.whiteTurn, 2, y) &&
					!gameObj.getPiece(gameObj.whiteTurn, 3, y)
				) {
					successful &= gameObj.moveFromTo(gameObj.whiteTurn, 4, y, 2, y)
					successful &= gameObj.moveFromTo(gameObj.whiteTurn, 0, y, 3, y)
				}
			} else if (side === "right") {
				if (
					gameObj.getPiece(gameObj.whiteTurn, 4, y) instanceof King &&
					gameObj.getPiece(gameObj.whiteTurn, 7, y) instanceof Rook &&
					!gameObj.getPiece(gameObj.whiteTurn, 5, y) &&
					!gameObj.getPiece(gameObj.whiteTurn, 6, y)
				) {
					successful &= gameObj.moveFromTo(gameObj.whiteTurn, 4, y, 6, y)
					successful &= gameObj.moveFromTo(gameObj.whiteTurn, 5, y, 7, y)
				}
			}
			if (successful) {
				game.boardState = gameObj.boardToJSONString();
				game.turn = !game.turn;
				game.save(); // Sequelize call to update the saved model in the db
				res.status(200).json({ response: game.dataValues });
			} else {
				res.status(400).json({ error: "You cannot make this move" });
			}
		});
	},

	getMoves(req, res, next) {},
};

export default GameController;
