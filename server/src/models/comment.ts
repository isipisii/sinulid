import { InferSchemaType, model, Schema } from "mongoose";

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user: {
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