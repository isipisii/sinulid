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
    liked_by: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
    ]
},

{timestamps: true, toJSON: { virtuals: true }})

postSchema.virtual("likes").get(function (){
    return this.liked_by.length
})

postSchema.virtual("type").get(function (){
    return "post"
})

type PostSchema = InferSchemaType<typeof postSchema>

export default model<PostSchema>("Post", postSchema)