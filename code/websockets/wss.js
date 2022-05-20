import WebSocket from "ws";

const QueueWS = new WebSocket.Server({
	noServer: true /* , path: "/waitQueue" */,
});

export default QueueWS;
