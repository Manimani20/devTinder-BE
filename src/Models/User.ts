import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },  
    lastName: { type: String, required: true },
    email: { type: String, required: true,  unique:true},
    password: { type: String, required: true },
    gender: { type: String,
        enum:{
            values:["male","female","others"],
            message:`{VALUE} is incorrect gender type`
        }},
    age: { type: Number , min:19, max: 100},
    mobile: { type: String },
    skills: { type: [String], },
    photoUrl: { type: String },
    about: { type: String },
},{ timestamps: true }
)


export const User = mongoose.model('User', userSchema);