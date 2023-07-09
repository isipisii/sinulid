import { InferSchemaType, Schema, model } from "mongoose";

const repostSchema = new Schema({
    repostCreator: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User" 
    },
    post: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: "Post"
    }
},
{ timestamps: true })

type RepostSchema = InferSchemaType<typeof repostSchema>

export default model<RepostSchema>("Repost", repostSchema)