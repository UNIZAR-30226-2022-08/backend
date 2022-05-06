import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../database/database";

const User = sequelize.define(
	"user",
	{
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			primaryKey: true,
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
			validate: {
				len: [6, 12],
			},
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
		pendingChats: {
			type: DataTypes.STRING,
			allowNull: true,
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

User.belongsToMany(User, {
	through: UserFriendList,
	as: "Friend",
});

export default User;
export { UserFriendList };
