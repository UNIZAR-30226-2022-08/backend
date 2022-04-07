import { INTEGER, STRING } from 'sequelize';
import sequelize from '../sequelize/sequelize';

const AsyncGame = sequelize.define('async_game', {
	gameId: { 
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
	whitePlayer: {
		type: STRING,
		allowNull: false
	},
	blackPlayer: {
		type: STRING,
		allowNull: false,
	}
}, {
	freezeTableName: true // Model tableName will be the same as the model name
});

AsyncGame.sync().then(function () {

});

export default AsyncGame