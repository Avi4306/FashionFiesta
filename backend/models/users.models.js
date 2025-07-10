import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type :String,
        required : true,
        trim: true
    },
    email :
    {
        type :String,
        required : true,
    },
    password :
    {
        type:String,
        required:true,
    },
    profilePhoto:
    {
        type:[String],
        required:false,
    },
    designer:
    {
        type: Boolean,
        default : false
    }
},
{
    timestamps: true,
});

const User = mongoose.model("Users",userSchema);
export default User;