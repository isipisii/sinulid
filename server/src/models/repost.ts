import { InferSchemaType, Schema, model } from "mongoose";

const repostSchema = new Schema({
    repost_creator: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: "User" 
    },
    post: {
        type: Schema.Types.ObjectId, 
        ref: "Post"
    },
},
{ timestamps: true, toJSON: { virtuals: true }})

repostSchema.virtual("type").get(function (){
    return "repost"
})

type RepostSchema = InferSchemaType<typeof repostSchema>

export default model<RepostSchema>("Repost", repostSchema)