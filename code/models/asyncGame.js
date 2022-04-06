const Sequelize = require('sequelize');
const sequelize = require('../sequelize/sequelize')

var AsyncGame = sequelize.define('async_game', {
	gameId: { 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
	username: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [6,12]
		}
	},
	elo : {
		type: Sequelize.INTEGER,
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

module.exports = User