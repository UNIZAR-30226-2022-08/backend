import Sequelize from "sequelize";
import AsyncGame from "../models/AsyncGame";
import User, { UserFriendList } from "../models/User";

const CommunityController = {
	async getPublicProfile(req, res) {
		let username;
		try {
			let { username } = req.body;
		} catch (error) {
			res.status(400).json({ error: "Parametros incorrectos" }).send();
		}
		User.findOne({
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
				const playedGames = AsyncGame.findAndCountAll({
					where: {
						where: Sequelize.and(
							Sequelize.or(
								{ whitePlayer: username },
								{ blackPlayer: username }
							),
							{ inProgress: false }
						),
					},
				}).count;

				const wonGames = AsyncGame.findAndCountAll({
					where: Sequelize.and(
						Sequelize.or(
							{ whitePlayer: username, whiteWon: true },
							{ blackPlayer: username, blackWon: true }
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

				const recentGames = AsyncGame.find({
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
					.error(function (error) {
						return error;
					});

				const response = {
					user,
					stats,
					recentGames,
				};
				res.status(200).json({ response }).send();
				res.send();
			})
			.error(function (error) {
				res.status(400).json({ error }).send();
			});
	},

	async addFriend(req, res) {
		if (req.session.username === null || req.body.friend === null)
			return res.status(400).json({ error: "invalid request" }).send();

		const friendship = await UserFriendList.findOne({
			where: Sequelize.or(
				{
					userUsername: [req.session.username, req.body.friend],
				},
				{
					FriendUsername: [req.session.username, req.body.friend],
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

		return User.findOne({ where: { username: req.session.username } })
			.then((user) => {
				User.findOne({ where: { username: req.body.friend } }).then((other) =>
					other.addFriend(user)
				);
			})
			.then(() => res.status(200).send())
			.catch((err) => res.status(400).json({ error: err.message }).send());
	},
	async removeFriend(req, res) {
		if (req.session.username === null || req.body.friend === null)
			return res.status(400).json({ error: "invalid request" }).send();

		const removed = await UserFriendList.destroy({
			where: Sequelize.and(
				{ accepted: true },
				Sequelize.or(
					{
						userUsername: req.session.username,
						FriendUsername: req.body.friend,
					},
					{
						userUsername: req.body.friend,
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
		if (req.session.username === null || req.body.friend === null)
			res.status(400).json({ error: "user is already friend" }).send();

		const friendship = await UserFriendList.findOne({
			where: Sequelize.or(
				{
					userUsername: [req.session.username, req.body.friend],
				},
				{
					FriendUsername: [req.session.username, req.body.friend],
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
};

export default CommunityController;
