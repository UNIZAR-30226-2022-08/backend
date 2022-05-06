import { Router } from "express";
import CommunityController from "../controller/CommunityController";
import validSession from "../util/validSession";

const communityRouter = Router();

// session validation middleware
communityRouter.use(validSession);

communityRouter.put("/addFriend", CommunityController.addFriend);
communityRouter.delete("/removeFriend", CommunityController.removeFriend);
communityRouter.put(
	"/acceptFriendRequest",
	CommunityController.acceptFriendRequest
);
communityRouter.get(
	"/getFriendRequests",
	CommunityController.getFriendRequests
);
communityRouter.get("/getFriends", CommunityController.getFriends);
//communityRouter.get('/getAllChats', CommunityController.getAllChats)
//communityRouter.get('/sendMessage', CommunityController.sendMessage)
//TODO añadir estos metodos
communityRouter.get("/getPublicProfile", CommunityController.getPublicProfile);

export default communityRouter;
