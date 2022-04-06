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

router.post('/register', function(req, res) {
	const {username, email, password } = req.body
	let user = User.create({
		username: username,
		email: email,
		password: password
	});
	console.log(user)

});
	
router.post('/login', function(req, res) {
	if (req.session.userId) {
		res.status(403).json({ status: 'failure', message: 'User already logged in' })
		return
	}
	const {email, password} = req.body
	//console.log(req.body) lo que recibimos
});


router.post('/changePassword', function(req, res) {
	const {email, newPassword} = req.body
	
});

router.all('checkSession',(req,res) => {
		res.send(req.session);
});

router.get("logout",(req,res) => {
		req.session.destroy();
		res.status(201).json({ status: 'success', message: 'Logged out' })
});

module.exports = router