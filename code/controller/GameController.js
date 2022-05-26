/* eslint-disable no-console */
/* eslint-disable no-useless-return */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import Sequelize from "sequelize";
import Game, { BlackPlayer, WhitePlayer } from "../game/Game";
import King from "../game/piezas/King";
import Rook from "../game/piezas/Rook";
import GameModel from "../models/GameModel";
import UserModel from "../models/UserModel";
import { containsParams } from "../util/util";

// const matchmakingWaitingList = [];

const GameController = {
	async startAsyncGame(req, res) {
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
			turn: newGame.turn,
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

	async startSyncGame(req, res) {
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
			turn: newGame.turn,
			whiteWon: null,
			inProgress: true,
			isAsync: false,
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

	async getGame(req, res) {
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

	async getActiveGames(req, res) {
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

	async move(req, res) {
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
					return;
				}
				if (
					(game.blackPlayer === username && game.turn) ||
					(!game.turn && game.whitePlayer === username)
				) {
					res.status(400).json({ error: "It's not your turn" });
					return;
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

	async promotePawn(req, res) {
		if (!containsParams(["gameId", "x", "y", "wantedPiece"], req)) {
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
						return;
					}
				} else {
					player = BlackPlayer;
					if (y !== 0) {
						res.status(400).json({ error: "You can't promote that piece" });
						return;
					}
				}
				curGame.deletePiece(player, Number(x), Number(y));
				curGame.addPiece(player, wantedPiece, Number(x), Number(y));
				game.boardState = curGame.boardToJSONString();
				game.save(); // Sequelize call to update the saved model in the db
				res.status(200).send();
			})
			.catch(function (error) {
				console.trace();
				console.log(error);
				res.status(400).json(error);
			});
	},

	async moverLoco(req, res) {
		// const { username } = req.session;
		if (!containsParams(["gameId", "x1", "y1", "x2", "y2"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { gameId, turn, x1, y1, x2, y2 } = req.body;
		return GameModel.findByPk(gameId)
			.then(function (game) {
				if (!game) {
					res
						.status(400)
						.json({ error: "Couldn't find the game, ID is wrong" });
					return;
				}
				const gameObj = new Game(game.dataValues);
				console.log("Successfully created game object");
				const successful = gameObj.moveFromTo(
					turn,
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

	async castle(req, res) {
		if (!containsParams(["gameId", "side"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}

		const { username } = req.session;
		const { gameId, side } = req.body;

		GameModel.findByPk(gameId).then(function (game) {
			const gameObj = new Game(game);
			if (
				(game.blackPlayer === username && game.turn) ||
				(!game.turn && game.whitePlayer === username)
			) {
				res.status(400).json({ error: "It's not your turn" });
				return;
			}

			let y;
			if (gameObj.turn) {
				y = 0;
			} else {
				y = 7;
			}
			let successful = true;
			if (side === "left") {
				if (
					gameObj.getPiece(gameObj.turn, 4, y) instanceof King &&
					gameObj.getPiece(gameObj.turn, 0, y) instanceof Rook &&
					!gameObj.getPiece(gameObj.turn, 1, y) &&
					!gameObj.getPiece(gameObj.turn, 2, y) &&
					!gameObj.getPiece(gameObj.turn, 3, y)
				) {
					successful &&= gameObj.moveFromTo(gameObj.turn, 4, y, 2, y);
					successful &&= gameObj.moveFromTo(gameObj.turn, 0, y, 3, y);
				}
			} else if (side === "right") {
				if (
					gameObj.getPiece(gameObj.turn, 4, y) instanceof King &&
					gameObj.getPiece(gameObj.turn, 7, y) instanceof Rook &&
					!gameObj.getPiece(gameObj.turn, 5, y) &&
					!gameObj.getPiece(gameObj.turn, 6, y)
				) {
					successful &&= gameObj.moveFromTo(gameObj.turn, 4, y, 6, y);
					successful &&= gameObj.moveFromTo(gameObj.turn, 7, y, 5, y);
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
	async endGame(req, res) {
		if (!containsParams(["gameId", "winnerPlayer"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { gameId, winnerPlayer } = req.body;

		GameModel.findByPk(gameId)
			.then(function (game) {
				if (!game) {
					res
						.status(400)
						.json({ error: "Couldn't find the game, ID is wrong" });
					return;
				}
				game.inProgress = false;
				let loserPlayer;


				game.whiteWon = winnerPlayer === game.whitePlayer;
				game.finishTimestamp = Date.now();
				game.draw = winnerPlayer.toLowerCase() === "draw";
				game.update();
				console.log("Updated game: ", game)
				if (game.draw === true) {
					res.status(200).json({ response: game.dataValues });
					return;
				}
				if (game.whiteWon) {
					loserPlayer = game.blackPlayer
				} else {
					loserPlayer = game.whitePlayer
				}
				UserModel.findByPk(winnerPlayer).then(async function (winningPlayer) {
					winningPlayer.money += 100;
					const losingPlayer = await UserModel.findByPk(loserPlayer);
					console.log("Winning player: ", winningPlayer)
					console.log("Losing player ", losingPlayer)
					const eloWinning = winningPlayer.elo;
					const eloLosing = losingPlayer.elo;
					if (eloWinning > eloLosing) {
						winningPlayer.elo += 25 * (eloLosing / eloWinning);
						losingPlayer.elo -= 25 * (eloLosing / eloWinning);
					} else {
						winningPlayer.elo += 25 * (eloWinning / eloLosing);
						losingPlayer.elo -= 25 * (eloWinning / eloLosing);
					}
					winningPlayer.update();
					losingPlayer.update();
					console.log("Updated")
				});
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
	async getAllowedMoves(req, res) {
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
				const gameObj = new Game(game.dataValues);
				res
					.status(200)
					.json({ response: gameObj.getAllowedMoves(gameObj.turn) });
			})
			.catch(function (error) {
				console.trace();
				console.log(error);
				res.status(400).json(error);
				return;
			});
	},
};

export default GameController;
