import { INTEGER, STRING } from 'sequelize';
import sequelize from '../sequelize/sequelize';
import AsyncGame from "./AsyncGame"

const User = sequelize.define('user', {
	username: {
		type: STRING,
		unique: true,
		allowNull: false,
		primaryKey: true
	},
	email: {
		type: STRING,
		unique: true,
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: STRING,
		allowNull: false,
		validate: {
			len: [6,12]
		}
	},
	elo : {
		type: INTEGER,
		defaultValue: 800,
		validate: {
			min: 0
		}
	},
	money : {
		type: INTEGER,
		defaultValue: 0,
		validate: {
			min: 0
		}
	}
}, {
	freezeTableName: true // Model tableName will be the same as the model name
});

User.hasMany(AsyncGame, { foreignKey: {
    allowNull: false,
	foreignKey: 'whitePlayer'
} })
AsyncGame.belongsTo(User)
User.hasMany(AsyncGame, { foreignKey: {
    allowNull: false,
	foreignKey: 'blackPlayer'
} })
AsyncGame.belongsTo(User)


await User.sync({ alter: true });
await User.create({ username: "user1", password: "password", email: "a@b.com", elo:800 });
await User.create({ username: "user2", password: "password", email: "a@c.com", elo:800 });
await User.create({ username: "user3", password: "password", email: "a@d.com", elo:1000 });

export default User