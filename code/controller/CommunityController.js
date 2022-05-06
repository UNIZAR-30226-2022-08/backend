import Sequelize from "sequelize";
import GameModel from "../models/GameModel";
import UserModel, { UserFriendList } from "../models/UserModel";
import {containsParams} from "../util/util.js";
const CommunityController = {
	async getPublicProfile(req, res) {
		if (!containsParams(["username"], req)){
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return
		}

		const { username } = req.body;

		return UserModel.findOne({
			attributes: { include: ["username", "elo", "money"] },
			where: {
				username,
			},
		})
			.then(function (user) {
				if (user === null) {
					res.status(400).json({ error: "Couldn't find the game" });
					res.send();
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
					winrate: wonGames / playedGames,
					playedTournaments: 0,
					wonTournaments: 0,
					//TODO añadir torneos
				};

				const recentGames = GameModel.find({
					where: Sequelize.and(
						Sequelize.or({ whitePlayer: username }, { blackPlayer: username }),
						{ inProgress: false }
					),
					order: [["finishTimestamp", "DESC"]],
					limit: 10,
				})
					.then(function (games) {
						return games;
					})
					.catch(function (error) {
						return error;
					});

				const response = {
					user,
					stats,
					recentGames,
				};
				res.status(200).json({ response }).send();
			})
			.catch(function (error) {
				console.log(error);
				res.status(400).json({ error: error.message }).send();
			});
	},

	async addFriend(req, res) {
		if (!containsParams(["friend"], req)){
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return
		}
		const {friend} = req.body
		const friendship = await UserFriendList.findOne({
			where: Sequelize.or(
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
				return res.status(400).json({ error: "user is already friend" }).send();
			}
			return res
				.status(400)
				.json({ error: "a friend request is already pending" })
				.send();
		}

		console.log(friendship);

		return UserModel.findOne({ where: { username: req.session.username } })
			.then((user) => {
				UserModel.findOne({ where: { username: friend } }).then((other) =>
					other.addFriend(user)
				);
			})
			.then(() => res.status(200).send())
			.catch((err) => res.status(400).json({ error: err.message }).send());
	},
	async removeFriend(req, res) {
		if (!containsParams(["friend"], req)){
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return
		}
		const {friend} = req.body

		const removed = await UserFriendList.destroy({
			where: Sequelize.and(
				{ accepted: true },
				Sequelize.or(
					{
						userUsername: req.session.username,
						FriendUsername: friend,
					},
					{
						userUsername: friend,
						FriendUsername: req.session.username,
					}
				)
			),
		});

		if (removed < 1) {
			return res.status(400).json({ error: "user is not friend" }).send();
		}

		return res.status(200).send();
	},
	async acceptFriendRequest(req, res) {
		if (!containsParams(["friend"], req)){
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return
		}
		const {friend} = req.body

		const friendship = await UserFriendList.findOne({
			where: Sequelize.or(
				{
					userUsername: [req.session.username, friend],
				},
				{
					FriendUsername: [req.session.username, friend],
				}
			),
		});

		if (friendship === null || friendship.accepted) {
			return res
				.status(400)
				.json({ error: "no pending friend requests from user" })
				.send();
		}

		friendship.accepted = true;
		return friendship
			.save()
			.then(() => res.status(200).send())
			.catch((err) => res.status(400).json({ error: err.message }).send());
	},
	async getFriendRequests(req, res) {
		return UserFriendList.findAll({
			where: Sequelize.and(
				{ accepted: false },
				Sequelize.or(
					{
						userUsername: req.session.username,
					},
					{
						FriendUsername: req.session.username,
					}
				)
			),
			attributes: ["id", "FriendUsername", "accepted"],
		})
			.then((requests) => {
				const friendRequests = [];
				requests.forEach((friendRequest) => {
					friendRequests.push(friendRequest);
				});

				res.status(200).json(friendRequests).send();
			})
			.catch((err) => res.status(400).json({ error: err.message }).send());
	},
	async getFriends(req, res) {
		return UserFriendList.findAll({
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
			attributes: ["id", "FriendUsername", "accepted"],
		})
			.then((requests) => {
				const friendRequests = [];
				requests.forEach((friendRequest) => {
					friendRequests.push(friendRequest);
				});

				res.status(200).json(friendRequests).send();
			})
			.catch((err) => res.status(400).json({ error: err.message }).send());
	},
	async sendMessage(req, res) {
		if (!containsParams(["to", "body"], req)){
			res.status(400).json({ error: "Parametros incorrectos" }).send();
			return
		}
		const {username} = req.session
		const {to, message} = req.body
		const from = username

		//todo comprobar que el socket estea abierto
		let userisconnected = true
		if(userisconnected) {

		} else {
			return Message.create({
				from,
				to,
				message,
			}).then((message) => {
					if (messagge === null) {
						throw new Error("error sending message");
					}
					return res.status(201).send();
				})
				.catch((err) => res.status(400).json({ error: err.message }).send());
		}
	},
	async getAllChats(req, res) {
	}
};

export default CommunityController;
