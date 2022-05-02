import { Router } from "express";
import UserController from "../controller/UserController";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

// middleware that is specific to this router
/* router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

router.post("/changePassword", UserController.changePassword);
router.post("/logout", UserController.logout);
// router.get('/getPublicProfile', UserController.getPublicProfile)
// router.post("/editInfo", UserController.editInfo);
router.put("/addFriend", UserController.addFriend);
router.put("/acceptFriendRequest", UserController.acceptFriendRequest);
router.get("/getFriendRequests", UserController.getFriendRequests);
router.get("/getFriends", UserController.getFriends);

router.all("/checkSession", (req, res) => {
	res.json({ response: req.session });
});

export default router;
