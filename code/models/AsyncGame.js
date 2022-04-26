import { INTEGER, STRING } from "sequelize";
import sequelize from "../sequelize/sequelize";

const AsyncGame = sequelize.define(
	"async_game",
	{
		gameId: {
			type: INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: STRING,
			unique: true,
			allowNull: false,
		},
		email: {
			type: STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: STRING,
			allowNull: false,
		},
		whitePieces: {
			type: STRING,
			allowNull: false,
		},
		blackPieces: {
			type: STRING,
			allowNull: false,
		},
		turn: {
			type: STRING,
			allowNull: false,
		},
	},
	{
		freezeTableName: true, // Model tableName will be the same as the model name
	}
);

AsyncGame.sync().then(function () {});

export default AsyncGame;
