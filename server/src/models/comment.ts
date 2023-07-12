import { InferSchemaType, model, Schema } from "mongoose";

const commentSchema = new Schema({
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
})

type CommentSchema = InferSchemaType<typeof commentSchema>

export default model<CommentSchema>("Comment", commentSchema)