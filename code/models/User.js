import { INTEGER, STRING } from "sequelize";
import sequelize from "../sequelize/sequelize";
import bcrypt from "bcrypt";

const User = sequelize.define(
	"user",
	{
		username: {
			type: STRING,
			unique: true,
			allowNull: false,
			primaryKey: true,
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
			validate: {
				len: [6, 12],
			},
		},
		elo: {
			type: INTEGER,
			defaultValue: 800,
			validate: {
				min: 0,
			},
		},
		money: {
			type: INTEGER,
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
					user.password = bcrypt.hash(user.password, bcrypt.genSalt());
				}
			},
			beforeUpdate: async (user) => {
				if (user.password) {
					user.password = bcrypt.hashSync(user.password, bcrypt.genSalt());
				}
			},
		},
		instanceMethods: {
			validPassword: (password) => bcrypt.compareSync(password, this.password),
		},
		freezeTableName: true, // Model tableName will be the same as the model name
	}
);

User.prototype.validPassword = async (password, hash) =>
	bcrypt.compare(password, hash);

User.hasMany(User, {
	foreignKey: {
		allowNull: false,
		foreignKey: "friends",
	},
});

User.hasMany(User, {
	foreignKey: {
		allowNull: false,
		foreignKey: "friendRequests",
	},
});

await User.sync({ alter: true });
await User.create({
	username: "user1",
	password: "password",
	email: "a@b.com",
	elo: 800,
});
await User.create({
	username: "user2",
	password: "password",
	email: "a@c.com",
	elo: 800,
});
await User.create({
	username: "user3",
	password: "password",
	email: "a@d.com",
	elo: 1000,
});

export default User;
