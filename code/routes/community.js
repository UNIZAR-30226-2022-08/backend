import { Router } from 'express';
import User from '../models/User';
import AsyncGame from '../models/asyncGame';
import CommunityController from '../controller/GameController';
const router = Router()

// middleware that is specific to this router
/* router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

router.put('/addFriend', CommunityController.addFriend)
router.get('/removeFriend', CommunityController.removeFriend)
router.get('/getFriendRequests', CommunityController.getFriendRequests)
router.get('/getAllChats', CommunityController.getAllChats)
router.get('/sendMessage', CommunityController.sendMessage)
router.get('/getPublicProfile', CommunityController.getPublicProfile)

export default router