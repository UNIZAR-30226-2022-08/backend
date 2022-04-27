// Requiring module
import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
// For using sessions. cookieParser is the needed middleware
import cookieParser from "cookie-parser";
import sessions from "express-session";

import "dotenv/config";
import accountRouter from "./routes/account";
import gameRouter from "./routes/game";
import communityRouter from "./routes/community";
/// ///////////////////////////////////////////////////////////////////////////////////////////////
const app = express();
app.use(json());
app.use(
	urlencoded({
		// to support URL-encoded bodies
		extended: true,
	})
);
const oneDay = 1000 * 60 * 60 * 24;
app.use(
	sessions({
		secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
		saveUninitialized: true,
		cookie: { maxAge: oneDay },
		resave: false,
	})
);
app.use(cookieParser());

app.use("/account", accountRouter);
app.use("/game", gameRouter);
app.use("/community", communityRouter);

// Port Number
const PORT = process.env.PORT || 5000;

// Server Setup
app.listen(
	PORT,
	console.log(
		`Server started on port ${PORT}\n`
		// + "List of routes: ", app._router.stack
	)
);
