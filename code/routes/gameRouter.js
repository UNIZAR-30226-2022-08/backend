import { Router } from "express";
import GameController from "../controller/GameController";
import validSession from "../util/validSession";

const gameRouter = Router();

// session validation middleware
gameRouter.use(validSession);

gameRouter.put("/newAsyncGame", GameController.createAsyncGame);
gameRouter.get("/getGame", GameController.getGame);
gameRouter.get("/getActiveGames", GameController.getActiveGames);
gameRouter.get("/move", GameController.move);
gameRouter.get("/getMoves", GameController.getMoves);

export default gameRouter;
