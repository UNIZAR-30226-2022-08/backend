/* eslint-disable consistent-return */
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";
import { containsParams } from "../util/util";

const AccountController = {
	async register(req, res, next) {
		if (!containsParams(["username", "email", "password"], req)) {
			console.log(req.body);
			res.status(400).json({ error: "Parametros incorrectos" });
			next();
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

				res.status(201);
				next();
			})
			.catch((err) => {
				console.trace();
				console.log(error);
				res.status(400).json({ error: err.message });
				next();
			});
	},
	async login(req, res, next) {
		if (req.session.username) {
			return res.status(400).json({ message: "User already logged in" });
		}
		if (!containsParams(["email", "password"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" });
			return;
		}
		const { email, password } = req.body;

		return UserModel.findOne({ where: { email } })
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
				res.status(200);
				next();
			})
			.catch((error) => {
				console.trace();
				console.log(error);
				res.status(400).json({ error: error.message });
				next();
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
			next();
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
				res.status(201);
				next();
			})
			.catch(function (err) {
				res.status(400).json({ error: err.errors });
				next();
			});
	},
	async logout(req, res, next) {
		req.session.destroy();
		res.status(201).json({ status: "success", message: "Logged out" });
		next();
	},
};

export default AccountController;
