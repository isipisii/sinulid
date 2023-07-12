import { InferSchemaType, Schema, model } from "mongoose";
// initial
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true,
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        select: false 
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    bio: {
        type: String,
        required: false
    },
    displayed_picture:{
        url: {
            type: String
        },
        cloudinary_id: {
            type: String
        }
    },
    link: {
        type: String,
        required: false
    },
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
},
{ timestamps: true });

type UserType = InferSchemaType<typeof userSchema>;

export default model<UserType>("User", userSchema);
