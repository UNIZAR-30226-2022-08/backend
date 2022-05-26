import WebSocket from "ws";
import Sequelize from "sequelize";
import GameModel from "../models/GameModel";
import UserModel, { UserFriendList } from "../models/UserModel";
import { containsParams } from "../util/util";

const wss = new WebSocket.Server({
	noServer: true, /*  path: "/waitQueue", */
});
const wssArray = []
wss.on("connection", (ws, req) => {
	const { username } = req.session;
	UserModel.findByPk(username)
	.then((user) => {

	})
	.error(function(error){

	})

	ws.on("message", (body) => {
		try {
			const { event } = JSON.parse(body);
			if (event === "chat") {
				const { to, message } = JSON.parse(body);
				console.log(username);
				console.log(to);
				console.log(message);
				wssArray[to].send({username, message})
			} else if (event === "syncGame") {
				console.log(username);
			} else if (event === "emoji") {

			}
		} catch (error) {
			console.trace();
			console.error(error);
		}
	});

	ws.on("close", function close() {
		try {
				const { username } = req.session;
				delete wssArray[username]
			} catch (error) {
				console.trace();
				console.error(error);
			}
		})
	wssArray[username] = ws
});

export default wss;
