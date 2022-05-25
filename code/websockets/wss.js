import WebSocket from "ws";

const wss = new WebSocket.Server({
	noServer: true, /*  path: "/waitQueue", */
});

wss.on("connection", (ws, req) => {
	const { username } = req.session;

	ws.on("message", (body) => {
		try {
			const { event } = JSON.parse(body);
			if (event === "chat") {
				const { to, message } = JSON.parse(body);
				console.log(username);
				console.log(to);
				console.log(message);
			} else if (event === "syncGame") {
				console.log(username);
			}
		} catch (error) {
			console.trace();
			console.error(error);
		}
	});
});

export default wss;
