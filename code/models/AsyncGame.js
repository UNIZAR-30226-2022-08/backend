import { INTEGER, STRING } from "sequelize";
import sequelize from "../sequelize/sequelize";

const AsyncGame = sequelize.define('async_game', {
	gameId: { 
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
	whitePieces: {
		type: STRING,
		allowNull: false
	},
	blackPieces: {
		type: STRING,
		allowNull: false,
	},
	whiteTurn: {
		type: BOOLEAN,
		allowNull: false,
		default: true
	},
	inProgress: {
		type: BOOLEAN,
		allowNull: false,
		default: false
	},
	isAsync: {
		type: BOOLEAN,
		allowNull: false
	},
	//This field must be used together with "inProgress". If game is still in progress
	//then the value of this is useless
	whiteWon: {
		type: BOOLEAN,
		allowNull: false,
		default: true
	}
);

await AsyncGame.sync({ alter: true });

export default AsyncGame;
