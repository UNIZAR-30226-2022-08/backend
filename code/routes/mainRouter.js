import Router from "express";
import accountRouter from "./accountRouter";
import gameRouter from "./gameRouter";

const mainRouter = Router();
mainRouter.use("/account", accountRouter);
mainRouter.use("/game", gameRouter);

export default mainRouter;
