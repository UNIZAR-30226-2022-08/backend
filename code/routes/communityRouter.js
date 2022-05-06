import { Router } from 'express';
import User from '../models/User';
import AsyncGame from '../models/asyncGame';
import CommunityController from '../controller/CommunityController';
const communityRouter = Router()
import validSession from "../util/validSession";

// session validation middleware
accountRouter.use(validSession);


communityRouter.put("/addFriend", CommunityController.addFriend);
communityRouter.delete("/removeFriend", CommunityController.removeFriend);
communityRouter.put("/acceptFriendRequest", CommunityController.acceptFriendRequest);
communityRouter.get("/getFriendRequests", CommunityController.getFriendRequests);
communityRouter.get("/getFriends", CommunityController.getFriends);
//communityRouter.get('/getAllChats', CommunityController.getAllChats)
//communityRouter.get('/sendMessage', CommunityController.sendMessage)
//TODO añadir estos metodos
communityRouter.get('/getPublicProfile', CommunityController.getPublicProfile)



export default communityRouter