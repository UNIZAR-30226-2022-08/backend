import { Router } from "express";
import AccountController from "../controller/AccountController";
import { validSession } from "../util/util";

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

accountRouter.post("/changePassword", AccountController.changePassword);
accountRouter.post("/logout", AccountController.logout);
// router.get('/getPublicProfile', AccountController.getPublicProfile)
// router.post("/editInfo", AccountController.editInfo);

export default accountRouter;
