import bcrypt from "bcrypt";
import { request } from "express";
import Sequelize from "sequelize";
import User, { UserFriendList, UserFriendRequests } from "../models/User";

const AccountController = {
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
		return res
			.status(201)
			.json({ status: "success", message: "Logged out" })
			.send();
	},

};

export default AccountController;
