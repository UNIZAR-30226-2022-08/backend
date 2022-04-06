// Requiring module
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors') 
require('dotenv').config()
//For using sessions. cookieParser is the needed middleware
const cookieParser = require("cookie-parser");
const sessions = require('express-session');


//////////////////////////////////////////////////////////////////////////////////////////////////
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
	}))
app.use(cors())
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use(cookieParser());


const accountRouter = require('./routes/account')

app.use('/account', accountRouter)

// Port Number
const PORT = process.env.PORT ||5000;

// Server Setup
app.listen(PORT,console.log(
	`Server started on port ${PORT}\n` 
	//+ "List of routes: ", app._router.stack
));
