import mongoose from "mongoose";
import { User } from "./User";
const connectionRequestsSchema=new mongoose.Schema({
    fromUserId:{type:mongoose.Schema.Types.ObjectId,ref:User,required:true},
    toUserId:{type:mongoose.Schema.Types.ObjectId,ref:User,required:true},
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","accepted","rejected","pending","interested"],
            message:`{VALUE} is incorrect status type`

        }
    }
},{timestamps:true}
)
connectionRequestsSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestsSchema.pre("save", function(next) {
    const connectionRequest = this;
    if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
        throw new Error("You cannot send a connection request to yourself.");
    }
    next();
})
export const ConnectionRequests=mongoose.model("ConnectionRequests",connectionRequestsSchema)