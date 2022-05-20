import Sequelize from "sequelize";

const database = new Sequelize(process.env.DB_CONN_URI, {
	dialect: "postgres",
	dialectOptions: {
		ssl: {
			// 		require: false,
			rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
		},
	},
	pool: {
		max: 9,
		min: 0,
		idle: 10000,
	},
	logging: console.log,
});

database
	.authenticate()
	.then(() => {
		console.log("Success!");
	})
	.catch((err) => {
		console.log(err);
	});

database.sync({ alter: true });
console.log("All models were synchronized successfully.");

export default database;
