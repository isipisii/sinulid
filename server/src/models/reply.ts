import { InferSchemaType, model, Schema } from "mongoose";

const replySchema = new Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {timestamps: true})

type ReplySchema = InferSchemaType<typeof replySchema>

export default model<ReplySchema>("Reply", replySchema)