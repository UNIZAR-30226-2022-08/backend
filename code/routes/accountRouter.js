import { Router } from "express";
import UserController from "../controller/UserController";
import validSession from "../util/validSession";

const accountRouter = Router();

accountRouter.post("/register", UserController.register);
accountRouter.post("/login", UserController.login);

// session validation middleware
accountRouter.use(validSession);

accountRouter.post("/changePassword", UserController.changePassword);
accountRouter.post("/logout", UserController.logout);
// router.get('/getPublicProfile', UserController.getPublicProfile)
// router.post("/editInfo", UserController.editInfo);
accountRouter.put("/addFriend", UserController.addFriend);
accountRouter.put("/acceptFriendRequest", UserController.acceptFriendRequest);
accountRouter.get("/getFriendRequests", UserController.getFriendRequests);
accountRouter.get("/getFriends", UserController.getFriends);

accountRouter.all("/checkSession", (req, res) => {
	res.json({ response: req.session });
});

export default accountRouter;
