import { InferSchemaType, Schema, model } from "mongoose";

const postSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User" 
    },
    content: {
        type: String,
        required: false
    },
    image: {
        url: {
            type: String
        },
        cloudinary_id: {
            type: String
        }
    },
    likes: {
        type: Number,
        default: 0
    },
    liked_by: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
},
{timestamps: true})

type PostSchema = InferSchemaType<typeof postSchema>

export default model<PostSchema>("Post", postSchema)