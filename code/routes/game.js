import { Router } from "express";
import GameController from "../controller/GameController";

const router = Router();

router.put("/newAsyncGame", GameController.createAsyncGame);
router.get("/getState", GameController.getGame);
router.get("/getActiveGames", GameController.getActiveGames);
router.get("/move", GameController.move);
router.get("/getMoves", GameController.getMoves);

export default router;
