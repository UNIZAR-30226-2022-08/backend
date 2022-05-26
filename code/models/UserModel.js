import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../database/database";

const UserModel = sequelize.define(
	"user",
	{
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			primaryKey: true,
			validate: {
				len: [4, 12],
			},
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		elo: {
			type: DataTypes.INTEGER,
			defaultValue: 800,
			validate: {
				min: 0,
			},
		},
		money: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},
	},
	{
		hooks: {
			beforeCreate: async (user) => {
				if (user.password) {
					user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
				}
			},
			beforeUpdate: async (user) => {
				if (user.password) {
					user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
				}
			},
		},
		freezeTableName: true, // Model tableName will be the same as the model name
	}
);

const UserFriendList = sequelize.define("friendList", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	accepted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
});

UserModel.belongsToMany(UserModel, {
	through: UserFriendList,
	as: "Friend",
});

export default UserModel;
export { UserFriendList };
