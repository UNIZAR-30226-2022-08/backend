import { Router } from 'express';
import User from '../models/user';

const router = Router()

// middleware that is specific to this router
/* router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

router.post('/register', async function(req, res) {
	const {username, email, password } = req.body
	await User.create({
		username,
		email,
		password
	}). then(function(){
		res.status(201).send();
	})
	.catch(function(err) {
		res.status(400).json({ error: err.errors}).send()
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
			email,
			password
		}
	}).then(function(user) {
		if(user.length !== 0){
			const {session} = req;
			session.userId=user.dataValues.userId
			session.username=user.dataValues.username
			session.email=user.dataValues.email
			res.status(200).send();
		} else {
			res.status(400).json({ error: "Invalid email or password"}).send();
			
		}
	})
});


router.post('/changePassword', async function(req, res) {
	const {email, newPassword} = req.body
	await User.update({
		password: newPassword,
		where: {
			email
		}
	})
	.then(function() {
		res.status(201).send();
	})
	.catch(function(err) {
		res.status(400).json({ error: err.errors}.send())
		
	});
	
});

router.all('/checkSession',(req,res) => {
		res.json(req.session);
});

router.post("/logout",(req,res) => {
		req.session.destroy();
		res.status(201).json({ status: 'success', message: 'Logged out' })
});

export default router