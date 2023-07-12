import { InferSchemaType, Schema, model } from "mongoose";

const repostSchema = new Schema({
    repost_creator: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User" 
    },
    post_id: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: "Post"
    }
},
{ timestamps: true })

type RepostSchema = InferSchemaType<typeof repostSchema>

export default model<RepostSchema>("Repost", repostSchema)