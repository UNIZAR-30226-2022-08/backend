import { Router } from "express";
import GameController from "../controller/GameController";
import { validSession } from "../util/util";

const gameRouter = Router();

// session validation middleware
gameRouter.use(validSession);

gameRouter.put("/newAsyncGame", GameController.startAsyncGame);
gameRouter.put("/newSyncGame", GameController.startSyncGame);
gameRouter.get("/getGame", GameController.getGame);
// gameRouter.post("/startMatchmaking", GameController.startMatchMaking);
gameRouter.get("/getState", GameController.getGame);
gameRouter.get("/getActiveGames", GameController.getActiveGames);
gameRouter.post("/move", GameController.move);
gameRouter.post("/promotePawn", GameController.promotePawn);
gameRouter.post("/castle", GameController.castle); // Enroque
gameRouter.post("/endGame", GameController.endGame);
gameRouter.get("/getAllowedMoves", GameController.getAllowedMoves);

export default gameRouter;
