import { Router } from 'express';
import User from '../models/User';
import AsyncGame from '../models/asyncGame';
import CommunityController from '../controller/GameController';
const communityRouter = Router()

// middleware that is specific to this router
/* router.use((req, res, next) => {
		console.log('Time: ', Date.now())
		next()
})
*/

communityRouter.put('/addFriend', CommunityController.addFriend)
communityRouter.get('/removeFriend', CommunityController.removeFriend)
communityRouter.get('/getFriendRequests', CommunityController.getFriendRequests)
communityRouter.get('/getAllChats', CommunityController.getAllChats)
communityRouter.get('/sendMessage', CommunityController.sendMessage)
communityRouter.get('/getPublicProfile', CommunityController.getPublicProfile)

export default communityRouter