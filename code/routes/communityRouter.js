import { Router } from "express";
import CommunityController from "../controller/CommunityController";
import { validSession } from "../util/util";

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
communityRouter.get("/sendMessage", CommunityController.sendMessage);
communityRouter.get("/getAllChats", CommunityController.getAllChats);
communityRouter.get("/getPublicProfile", CommunityController.getPublicProfile);

export default communityRouter;
