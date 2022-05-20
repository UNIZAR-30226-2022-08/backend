import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";

import cookieParser from "cookie-parser";
import sessions from "express-session";

import "dotenv/config";

import database from "./database/database";
import mainRouter from "./routes/mainRouter";

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
app.use(
	sessions({
		secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
		saveUninitialized: true,
		cookie: { maxAge: oneDay },
		resave: false,
	})
);
app.use(cookieParser());

app.use("/", mainRouter);

// Port Number
const PORT = process.env.PORT || 5000;
// Server Setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));
