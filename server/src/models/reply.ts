import { InferSchemaType, model, Schema } from "mongoose";

const replySchema = new Schema({
    post: {
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
    image: {
        url: {
            type: String
        },
        cloudinary_id: {
            type: String
        }
    },
    parent_reply: {
        type: Schema.Types.ObjectId,
        ref: "Reply",
    },
}, {timestamps: true})

type ReplySchema = InferSchemaType<typeof replySchema>

export default model<ReplySchema>("Reply", replySchema)