import { Router } from "express";
import User from "../models/User";
import AsyncGame from "../models/asyncGame";
import Game from "../game/Game";
import GameController from "../controller/GameController";
const router = Router();

// middleware that is specific to this router
/* router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

router.put("/newAsyncGame", GameController.createAsyncGame);
router.get("/getState", GameController.getGame);
router.get("/getActiveGames", GameController.getActiveGames);
router.get("/move", GameController.move);
router.get("/getMoves", GameController.getMoves);

export default router;
