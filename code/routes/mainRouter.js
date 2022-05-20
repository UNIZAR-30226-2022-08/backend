import Router from "express";
import accountRouter from "./accountRouter";
import gameRouter from "./gameRouter";
import communityRouter from "./communityRouter";

const mainRouter = Router();
mainRouter.use("/account", accountRouter);
mainRouter.use("/game", gameRouter);
mainRouter.use("/community", communityRouter);

export default mainRouter;
