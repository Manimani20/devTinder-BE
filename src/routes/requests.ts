import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { User } from '../Models/User';
import { ConnectionRequests } from '../Models/connectionRequests';


export const requestsRouter = express.Router();

//ignored or interested in a connection request
requestsRouter.post('/send/:status/:userId',authMiddleware, async (req:any, res:any) => {
    const { status, userId } = req.params;
    const fromUserId = req.user._id;
    const toUserId = userId;
    const alloedStatuses = ['ignored', 'interested'];
    if (!alloedStatuses.includes(status)) {
     res.status(400).json({ error: 'Invalid status provided' });
     return;
    }
    const toUser=await User.findById(userId);
    if (!toUser) {
        res.status(404).json({ error: 'toUser not found' });
        return;
    }
    const existingRequest = await ConnectionRequests.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId: userId, toUserId: fromUserId}
        ]
    })

    if (existingRequest) {
        res.status(400).json({ error: 'Connection request already exists' });
        return;
    }
    try {
        // Logic to handle ignored connection request
        const connectionRequest = new ConnectionRequests({
            fromUserId,
            toUserId,
            status})

        const data=await connectionRequest.save();
        res.status(200).json({ message: 'Connection request updated successfully',data: data });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

// Accept or reject a connection request
requestsRouter.post('/review/:status/:requestId',authMiddleware, async (req:any, res:any) => {
    const { status, requestId } = req.params;
    const alloedStatuses = ['accepted', 'rejected'];
    if (!alloedStatuses.includes(status)) {
     res.status(400).json({ message: 'Invalid status provided' });
     return;
    }
    const connectionRequest=await ConnectionRequests.findOne({
        _id: requestId,
        toUserId: req.user._id,
        status:"interested"
    });
    if (!connectionRequest) {
        res.status(404).json({ message: 'connection request not found' });
        return;
    }
    try {
        // Logic to handle ignored connection request
        connectionRequest.status = status;
        const data=await connectionRequest.save();
        res.status(200).json({ message: 'Connection request accepted successfully',data: data });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});