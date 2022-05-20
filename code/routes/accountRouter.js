import { Router } from "express";
import AccountController from "../controller/AccountController";
import validSession from "../util/validSession";

const accountRouter = Router();

accountRouter.post("/register", AccountController.register);
accountRouter.post("/login", AccountController.login);

//metodo de debug
accountRouter.get("/checkSession", (req, res) => {
	res.json({ response: req.session });
});

accountRouter.get("/checkSession", (req, res) => {
	res.json({ response: req.session });
});

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

export default accountRouter;
