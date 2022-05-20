import DataTypes from "sequelize";
import sequelize from "../database/database";
import UserModel from "./UserModel";

const GameModel = sequelize.define(
	"game",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		boardState: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		whiteTurn: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: true,
		},
		inProgress: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: false,
		},
		isAsync: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		// This field must be used together with "inProgress". If game is still in progress
		// then the value of this is useless
		whiteWon: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: true,
		},
		finishTimestamp: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		whitePlayer: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: UserModel,
				key: "username",
			},
		},
		blackPlayer: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: UserModel,
				key: "username",
			},
		},
	},
	{
		freezeTableName: true, // Model tableName will be the same as the model name
	}
);

export default GameModel;
