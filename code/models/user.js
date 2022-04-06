import { INTEGER, STRING } from 'sequelize';
import sequelize from '../sequelize/sequelize';

const User = sequelize.define('user', {
	userId: { type: INTEGER, autoIncrement: true, primaryKey: true },
	username: {
		type: STRING,
		unique: true,
		allowNull: false
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
	}
}, {
	freezeTableName: true // Model tableName will be the same as the model name
});

User.sync().then(function () {

});

export default User