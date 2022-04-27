import { Router } from 'express';
import UserController from '../controller/UserController';

const router = Router()

// middleware that is specific to this router
/* router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/changePassword', UserController.changePassword)
router.post("/logout", UserController.logout);

router.all('/checkSession',(req,res) => {
		res.json(req.session);
});

export default router