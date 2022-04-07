import { Router } from 'express';
import User from '../models/user';
import AsyncGame from '../models/asyncGame';
import Game from '../game/Game';
const router = Router()

// middleware that is specific to this router
/* router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

router.put('/newAsyncGame', async function(req, res) {
	const {whitePlayer, blackPlayer } = req.body
	await AsyncGame.create({
		whitePlayer,
        blackPlayer,
	}). then(function(row){
		res.status(201).json(row);
	})
	.catch(function(err) {
		res.status(400).json({ error: err.errors }).send()
	});
});
	
router.get('/getState', async function(req, res) {
	const {idGame} = req.body
    let g = new Game()
    console.log(g)
    //res.status(200).json({ whitePieces : g.getAllPieces("white"), blackPieces : g.getAllPieces("black")})
    res.status(200).json(g)
});


router.get('/getMoves', async function(req, res) {
	const {idGame, x, y} = req.body
	
});

router.post('/move',(req,res) => {
    const {idGame, x, y} = req.body
});

export default router