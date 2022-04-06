const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_CONN_URI, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false // <<<<<<< YOU NEED THIS
		}
	},
	pool: {
		max: 9,
		min: 0,
		idle: 10000
	}
});

sequelize.authenticate().then(() => {
	console.log("Success!");
}).catch((err) => {
	console.log(err);
});

module.exports = sequelize