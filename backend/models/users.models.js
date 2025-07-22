import mongoose from "mongoose";

const designerDetailsSchema = new mongoose.Schema({
  brandName: { type: String },
  portfolioUrl: { type: String },
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
        unique: true,
        required : true,
    },
    password :
    {
        type:String,
        required:true,
    },
    profilePhoto:
    {
        type:String,
        required:false,
        default : ''
    },
    role:
    {
        type: String,
        enum: ['customer', 'pending_designer', 'designer', 'admin'],
        default : "customer"
    },
    designerDetails: designerDetailsSchema,
    bio: { type: String, default: '' },
    socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: ''  },
    twitter: { type: String, default: ''  },
    website: { type: String, default: ''  },
    },
    location: {
    city: { type: String, default: ''  },
    state: { type: String, default: ''  },
    country: { type: String, default: ''  }
    },
},
{
    timestamps: true,
});

const User = mongoose.model("Users",userSchema);
export default User;