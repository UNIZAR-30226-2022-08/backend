/* eslint-disable no-useless-return */
import Sequelize from "sequelize";
import GameModel from "../models/GameModel";
import UserModel, { UserFriendList } from "../models/UserModel";
import { containsParams } from "../util/util";

const CommunityController = {
	async getPublicProfile(req, res) {
		if (!containsParams(["username"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}

		const { username } = req.body;

		UserModel.findOne({
			attributes: ["username", "elo", "money"],
			where: {
				username,
			},
		})
			.then(function (user) {
				if (user === null) {
					res.status(400).json({ error: "Couldn't find the game" });
					res;
					return;
				}
				const playedGames = GameModel.findAndCountAll({
					where: Sequelize.and(
						Sequelize.or({ whitePlayer: username }, { blackPlayer: username }),
						{ inProgress: false }
					),
				}).count;

				const wonGames = GameModel.findAndCountAll({
					where: Sequelize.and(
						Sequelize.or(
							{ whitePlayer: username, whiteWon: true },
							{ blackPlayer: username, whiteWon: false }
						),
						{ inProgress: false }
					),
				}).count;

				const stats = {
					playedGames,
					wonGames,
					winrate: playedGames === 0 ? wonGames / playedGames : 0,
					playedTournaments: 0,
					wonTournaments: 0,
					// TODO añadir torneos
				};

				const recentGames = GameModel.findAll({
					where: Sequelize.and(
						Sequelize.or({ whitePlayer: username }, { blackPlayer: username }),
						{ inProgress: false }
					),
					order: [["finishTimestamp", "DESC"]],
					limit: 10,
				});

				const response = {
					user,
					stats,
					recentGames,
				};
				res.status(200).json({ response });
			})
			.catch((error) => res.status(400).json({ error: error.message }));
	},

	async addFriend(req, res) {
		if (!containsParams(["friend"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { friend } = req.body;
		const friendship = await UserFriendList.findOne({
			where: Sequelize.and(
				{
					userUsername: [req.session.username, friend],
				},
				{
					FriendUsername: [req.session.username, friend],
				}
			),
		});

		if (friendship !== null) {
			if (friendship.accepted) {
				res.status(400).json({ error: "user is already friend" });
			}
			res.status(400).json({ error: "a friend request is already pending" });
			return;
		}

		UserModel.findOne({ where: { username: req.session.username } })
			.then((user) =>
				UserModel.findOne({ where: { username: req.body.friend } }).then(
					(other) => {
						if (other === null) {
							throw new Error("user does not exist");
						}
						user.addFriend(other);
					}
				)
			)
			.then(() => res.status(200))
			.catch((err) => res.status(400).json({ error: err.message }));
	},
	async removeFriend(req, res) {
		if (!containsParams(["friend"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { friend } = req.body;

		const removed = await UserFriendList.destroy({
			where: Sequelize.or(
				{
					userUsername: req.session.username,
					FriendUsername: friend,
				},
				{
					userUsername: friend,
					FriendUsername: req.session.username,
				}
			),
		});

		if (removed < 1) {
			res.status(400).json({ error: "user is not friend" });
		} else {
			res.status(200);
		}
	},
	async acceptFriendRequest(req, res) {
		if (!containsParams(["friend"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { friend } = req.body;

		const friendship = await UserFriendList.findOne({
			where: {
				userUsername: friend,
				FriendUsername: req.session.username,
			},
		}).catch((err) => {
			throw err;
		});

		if (friendship === null || friendship.accepted) {
			res.status(400).json({ error: "no pending friend requests from user" });
			return;
		}

		friendship.accepted = true;
		friendship
			.save()
			.then(() => res.status(200))
			.catch((err) => res.status(400).json({ error: err.message }));
	},
	async getFriendRequests(req, res) {
		var friendRequests = [];
		UserFriendList.findAll({
			where: {
				accepted: false,
				FriendUsername: req.session.username,
			},
			attributes: ["id", "userUsername", "FriendUsername"],
		})
			.then((requests) => {
				requests.forEach((friendRequest) => {
					friendRequests.push(friendRequest.userUsername);
				});

				// console.log("Antes de hacer el .send")
				// console.log(friendRequests)
				var temp = { response: friendRequests };
				// console.log(temp)
				res.status(200).json(temp);
				// console.log("Acabo de hacer el .send")
				return;
			})
			.catch((err) => {
				// return res.status(400).json({ error: err });
			});
	},
	async getFriends(req, res) {
		UserFriendList.findAll({
			where: Sequelize.and(
				{ accepted: true },
				Sequelize.or(
					{
						userUsername: req.session.username,
					},
					{
						FriendUsername: req.session.username,
					}
				)
			),
			attributes: ["id", "userUsername", "FriendUsername"],
		})
			.then((requests) => {
				if (requests == null) {
					console.log("No hay amigos");
				}
				const friends = [];
				requests.forEach((friendship) => {
					if (friendship.userUsername === req.session.username) {
						friends.push(friendship.FriendUsername);
					} else {
						friends.push(friendship.userUsername);
					}
				});
				// console.log("Antes de hacer el .send")
				// console.log(friends)
				var temp = { response: friends };
				// console.log(temp)
				res.status(200).json(temp);
				// console.log("Acabo de hacer el .send")
				return;
			})
			.catch((err) => {
				// return res.status(400).json({ error: err });
			});
	},
	async sendMessage(req, res) {
		if (!containsParams(["to", "body"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { username } = req.session;
		const { to, message } = req.body;
		const from = username;

		// todo comprobar que el socket estea abierto
		let userisconnected = true;
		if (userisconnected) {
		} else {
			Message.create({
				from,
				to,
				message,
			})
				.then((message) => {
					if (messagge === null) {
						throw new Error("error sending message");
					}
					return res.status(201);
				})
				.catch((err) => {
					return res.status(400).json({ error: err.message });
				});
		}
	},
	async getAllChats(req, res) {},
};

export default CommunityController;
