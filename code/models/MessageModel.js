import { DataTypes } from "sequelize";
import sequelize from "../database/database";
import UserModel from "./UserModel";

const MessageModel = sequelize.define("message", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	from: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: UserModel,
			key: "username",
		},
	},
	to: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: UserModel,
			key: "username",
		},
	},
	message: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	opened: {
		type: DataTypes.boolean,
		allowNull: false,
		defaultValue: true
	},
});

export default MessageModel;
