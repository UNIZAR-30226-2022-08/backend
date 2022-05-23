import { Router } from "express";
import GameController from "../controller/GameController";
import { validSession } from "../util/util";

const gameRouter = Router();

// session validation middleware
gameRouter.use(validSession);

gameRouter.put("/newAsyncGame", GameController.startAsyncGame);
gameRouter.get("/getGame", GameController.getGame);
gameRouter.post("/startMatchmaking", GameController.startMatchMaking);
gameRouter.get("/getState", GameController.getGame);
gameRouter.get("/getActiveGames", GameController.getActiveGames);
gameRouter.post("/move", GameController.move);
gameRouter.post("/promotePawn", GameController.move);
gameRouter.post("/castle", GameController.move); // Enroque
gameRouter.get("/getMoves", GameController.getMoves);

export default gameRouter;
