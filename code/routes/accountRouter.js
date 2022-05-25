import { Router } from "express";
import AccountController from "../controller/AccountController";
import { validSession } from "../util/util";

const accountRouter = Router();

accountRouter.post("/register", AccountController.register);
accountRouter.post("/login", AccountController.login);

//metodo de debug
accountRouter.get("/checkSession", (req, res) => {
	if (!req.session.username) {
		res.status(400).json({ error : "Usuario no logueado"})
	}
	res.json({ response: req.session });
});

accountRouter.get("/findAllUsers", AccountController.findAllUsers);
// session validation middleware
accountRouter.use(validSession);
accountRouter.post("/logout", AccountController.logout);
accountRouter.post("/changePassword", AccountController.changePassword);

export default accountRouter;
