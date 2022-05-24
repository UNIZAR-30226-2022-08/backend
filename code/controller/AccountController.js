/* eslint-disable consistent-return */
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";
import { containsParams } from "../util/util";

const AccountController = {
	async register(req, res, next) {
		if (!containsParams(["username", "email", "password"], req)) {
			console.log(req.body);
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { username, email, password } = req.body;
		return UserModel.create({
			username,
			email,
			password,
		})
			.then((user) => {
				if (user === null) {
					throw new Error("error creating user");
				}

				res.status(201).send();
				return;
			})
			.catch((err) => {
				console.trace();
				console.log(error);
				res.status(400).json({ error: err.message });
				return;
			});
	},
	async login(req, res, next) {
		if (req.session.username) {
			res.status(400).json({ message: "User already logged in" });
			return;
		}
		if (!containsParams(["email", "password"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { email, password } = req.body;

		UserModel.findOne({ where: { email } })
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
				res.status(200).send();
				return;
			})
			.catch((error) => {
				console.trace();
				console.log(error);
				res.status(400).json({ error: error.message });
				return;
			});
	},
	async findAllUsers(req, res, next) {
		return UserModel.findAll()
			.then(async (user) => {
				if (user === null) {
					return res.status(400).json({ error: "User not found" });
				}
				res.status(200).json(user);
				next();
			})
			.catch((error) => {
				console.trace();
				console.log(error);
				res.status(400).json({ error: error.message });
				next();
			});
	},
	async changePassword(req, res, next) {
		if (!containsParams(["username", "newPassword"], req)) {
			console.log(req.body);
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { newPassword } = req.body;
		const { username } = req.session;
		return UserModel.update({
			password: newPassword,
			where: {
				username,
			},
		})
			.then(function () {
				res.status(201).send();
				return;
			})
			.catch(function (err) {
				res.status(400).json({ error: err.errors });
				return;
			});
	},
	async logout(req, res, next) {
		req.session.destroy();
		res.status(201).json({ status: "success", message: "Logged out" });
		return;
	},
};

export default AccountController;
