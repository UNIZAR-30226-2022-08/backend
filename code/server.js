import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";

import cookieParser from "cookie-parser";
import sessions from "express-session";

import "dotenv/config";

import database from "./database/database";
import mainRouter from "./routes/mainRouter";
import QueueWS from "./websockets/wss";

const app = express();
app.use(json());
app.use(
	urlencoded({
		// to support URL-encoded bodies
		extended: true,
	})
);
app.use(
	cors({
		origin: "https://queenchess-frontweb.herokuapp.com",
		credentials: true,
	})
);
const oneDay = 1000 * 60 * 60 * 24;

const sessionParser = sessions({
	SameSite: "none",
	secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
	saveUninitialized: true,
	cookie: { maxAge: oneDay },
	resave: false,
});
app.use(sessionParser);
app.use(cookieParser());

app.use("/", mainRouter);

// Port Number
const PORT = process.env.PORT || 5000;
// Server Setup
const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

server.on("upgrade", async (request, socket, head) => {
	sessionParser(request, {}, () => {
		if (request.session.username === undefined) {
			socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
			socket.destroy();
		}
		QueueWS.handleUpgrade(request, socket, head, function done(ws) {
			QueueWS.emit("connection", ws, request);
		});
	});
});
