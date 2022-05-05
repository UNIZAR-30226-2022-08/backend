import bcrypt from "bcrypt";
import { request } from "express";
import Sequelize from "sequelize";
import User, { UserFriendList, UserFriendRequests } from "../models/User";

const UserController = {
	async register(req, res) {
		const { username, email, password } = req.body;
		return User.create({
			username,
			email,
			password,
		})
			.then((user) => {
				if (user === null) {
					throw new Error("error creating user");
				}

				return res.status(201).send();
			})
			.catch((err) => res.status(400).json({ error: err.message }).send());
	},
	async login(req, res) {
		if (req.session.username) {
			return res.status(400).json({ message: "User already logged in" });
		}
		const { email, password } = req.body;

		return User.findOne({ where: { email } })
			.then(async (user) => {
				if (user === null) {
					return res.status(400).json({ error: "User not found" });
				}

				const passwordIsValid = bcrypt.compareSync(password, user.password);

				if (!passwordIsValid) {
					throw Error("Invalid password");
				}
				const { session } = req;
				session.username = user.username;
				session.email = user.email;
				return res.status(200).send();
			})
			.catch((error) => {
				res.status(400).json({ error: error.message }).send();
			});
	},
	async changePassword(req, res) {
		const { newPassword } = req.body;
		const { username } = req.session;
		return User.update({
			password: newPassword,
			where: {
				username,
			},
		})
			.then(function () {
				res.status(201).send();
			})
			.catch(function (err) {
				res.status(400).json({ error: err.errors }).send();
			});
	},
	async logout(req, res) {
		req.session.destroy();
		res.status(201).json({ status: "success", message: "Logged out" });
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
			where: {
				userUsername: req.session.username,
				accepted: false,
			},
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
			where: {
				userUsername: req.session.username,
				accepted: true,
			},
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
	// async getPublicProfile(req, res) {
	// 	const { username } = req.body;
	// 	let user = User.findOne({
	// 		attributes: { include: ["username", "elo", "money"] },
	// 		where: {
	// 			username: username,
	// 		},
	// 	});
	// 	if (user === null) {
	// 		res.status(400).json({ error: "Couldn't find the game" });
	// 		res.send();
	// 		return;
	// 	} else {
	// 		var { count, rows } = await Project.findAndCountAll({
	// 			where: {
	// 				inProgress: false,
	// 				[Op.or]: [{ whitePlayer: username }, { blackPlayer: username }],
	// 			},
	// 		});
	// 		var playedCount = count;

	// 		const { count, rows } = await Project.findAndCountAll({
	// 			where: {
	// 				inProgress: false,
	// 				[Op.or]: [
	// 					{ [Op.and]: [{ whitePlayer: username }, { whiteWon: true }] },
	// 					{ [Op.and]: [{ blackPlayer: username }, { whiteWon: false }] },
	// 				],
	// 			},
	// 		});
	// 		var wonCount = count;

	// 		var stats = {
	// 			playedGames: playedCount,
	// 			wonGames: wonCount,
	// 			playedTournaments: 0,
	// 			wonTournaments: 0,
	// 		};

	// 		var response = {
	// 			user: user,
	// 			stats: stats,
	// 		};
	// 		res.status(200).json({ response: user });
	// 		res.send();
	// 	}
	// },
};

export default UserController;
