import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ConnectionRequests } from '../Models/connectionRequests';
import { User } from '../Models/User';

export const userRouter = express.Router();

//get user requests
userRouter.get('/requests', authMiddleware,async (req:any, res:any) => {
    try {
        const userId = req.user._id;
        const requests = await ConnectionRequests.find({
           toUserId: userId,
           status:"interested"
        }).populate('fromUserId', 'firstName lastName photoUrl about skills age'); 

        res.status(200).json({ message: 'Connection requests fetched successfully', data: requests });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

//get user connections
userRouter.get('/connections', authMiddleware,async (req:any, res:any) => {
    try {
        const userId = req.user._id;
        const requests = await ConnectionRequests.find({
              $or:[
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" }
              ]
        }).populate('fromUserId', 'firstName lastName photoUrl about skills age')
        .populate('toUserId', 'firstName lastName photoUrl about skills age');

        const connections = requests.map(request => {
            if(request.fromUserId.equals(userId)){
               return request.toUserId;
            }else{
                return request.fromUserId;
            }
        })
        
        res.status(200).json({ message: 'Connection requests fetched successfully', data: connections });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

//get user feed
userRouter.get('/feed', authMiddleware,async (req:any, res:any) => {
    try {
        const userId = req.user._id;
        const page= parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const requests = await ConnectionRequests.find({
              $or:[
                { fromUserId: userId},
                { toUserId: userId}
              ]
        });
        const userIds = new Set();
        requests.forEach(request => {
            userIds.add(request.fromUserId);
            userIds.add(request.toUserId);
        });
        const userIdsArray = Array.from(userIds);

        const users=await User.find({
            $and:[
           {_id:{$nin: userIdsArray}},
            {_id: { $ne: userId }}]
        }).skip((page - 1) * limit).limit(limit);
        res.status(200).json({ message: 'feed fetched successfully', data: users });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});