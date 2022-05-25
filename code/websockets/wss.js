import WebSocket from "ws";

const QueueWS = new WebSocket.Server({
	noServer: true /* , path: "/waitQueue" */,
});

QueueWS.on("connection", (ws, req) => {
	const { username } = req.session;

	ws.on("message", (body) => {
		try {
			const { to, message } = JSON.parse(body);
			console.log(username);
			console.log(to);
			console.log(message);
		} catch (error) {
			console.trace();
			console.error(error);
		}
	});
	ws.on("syncGame", (body) => {
		console.log(username);
		// leer elo desde la bbdd
	});
});

export default QueueWS;
