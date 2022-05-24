/* eslint-disable consistent-return */
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";
import { containsParams } from "../util/util";

const AccountController = {
	async register(req, res) {
		if (!containsParams(["username", "email", "password"], req)) {
			console.log(req.body);
			res.status(400).json({ error: "Parametros incorrectos" }).send();
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

				return res.status(201).send();
			})
			.catch((err) => {
				console.log(error);
				res.status(400).json({ error: err.message }).send();
			});
	},
	async login(req, res) {
		if (req.session.username) {
			return res.status(400).json({ message: "User already logged in" });
		}
		if (!containsParams(["email", "password"], req)) {
			res.status(400).json({ error: "Parametros incorrectos" }).send();
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
				return res.status(200).send();
			})
			.catch((error) => {
				console.log(error);
				res.status(400).json({ error: error.message }).send();
			});
	},
	async findAllUsers(req, res) {
		return UserModel.findAll()
			.then(async (user) => {
				if (user === null) {
					return res.status(400).json({ error: "User not found" });
				}
				return res.status(200).json(user).send();
			})
			.catch((error) => {
				console.log(error);
				res.status(400).json({ error: error.message }).send();
			});
	},
	async changePassword(req, res) {
		if (!containsParams(["username", "newPassword"], req)) {
			console.log(req.body);
			res.status(400).json({ error: "Parametros incorrectos" }).send();
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
