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

// session validation middleware
accountRouter.use(validSession);

accountRouter.post("/changePassword", AccountController.changePassword);
accountRouter.post("/logout", AccountController.logout);
// router.post("/editInfo", AccountController.editInfo);
//Todo añadir??? porque no hay en requisitos

export default accountRouter;
