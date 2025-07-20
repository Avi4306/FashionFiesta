import mongoose from "mongoose";

const designerDetailsSchema = new mongoose.Schema({
  brandName: { type: String },
  portfolioUrl: { type: String },
  bio: { type: String },
  verified: { type: Boolean, default: false },
  appliedAt: { type: Date },
}, { _id: false });

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
    role:
    {
        type: String,
        enum: ['customer', 'pending_designer', 'designer', 'admin'],
        default : "customer"
    },
    designerDetails: designerDetailsSchema
},
{
    timestamps: true,
});

const User = mongoose.model("Users",userSchema);
export default User;