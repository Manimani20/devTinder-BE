import mongoose from "mongoose";
const connectionRequestsSchema=new mongoose.Schema({
    fromUserId:{type:mongoose.Schema.Types.ObjectId,required:true},
    toUserId:{type:mongoose.Schema.Types.ObjectId,required:true},
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","accepted","rejected","pending","interested"],
            message:`{VALUE} is incorrect status type`

        }
    }
},{timestamps:true}

)
export const ConnectionRequests=mongoose.model("ConnectionRequests",connectionRequestsSchema)