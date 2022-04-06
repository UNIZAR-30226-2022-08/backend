const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize');
const User = require('../models/user')

// middleware that is specific to this router
/*router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

router.post('/register', async function(req, res) {
	const {username, email, password } = req.body
	await User.create({
		username: username,
		email: email,
		password: password
	}). then(function(){
		res.status(201).send();
	})
	.catch(function(err) {
		res.status(400).json({ error: err.errors}.send())
		return;
	});
});
	
router.post('/login', async function(req, res) {
	if (req.session.userId) {
		res.status(403).json({ status: 'failure', message: 'User already logged in' })
		return
	}
	const {email, password} = req.body;
	await User.findOne({
		where: {
			email: email,
			password: password
		}
	}).then(function(user){
		if(user.length!=0){
			session=req.session;
			session.userId=user.dataValues.userId
			session.username=user.dataValues.username
			session.email=user.dataValues.email
			res.status(200).send();
			return;
		} else {
			res.status(400).json({ error: "Invalid email or password"}).send();
			return;
		}
	})
});


router.post('/changePassword', function(req, res) {
	const {email, newPassword} = req.body
	await User.create({
		username: username,
		email: email,
		password: password
	}). then(function(){
		res.status(201).send();
	})
	.catch(function(err) {
		res.status(400).json({ error: err.errors}.send())
		return;
	});
	
});

router.all('/checkSession',(req,res) => {
		res.json(req.session);
});

router.get("/logout",(req,res) => {
		req.session.destroy();
		res.status(201).json({ status: 'success', message: 'Logged out' })
});

module.exports = router