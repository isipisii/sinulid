import { RequestHandler } from "express"
import CommentModel from "../models/comment"
import { CustomRequest } from "../app"
import createHttpError from "http-errors"

type CreateCommentBody = {
    content: string
}

type CommentParams ={
    postId: string
}

type DeleteCommentParams = {
    commentId: string
}

export const createComment: RequestHandler<CommentParams> = async(req: CustomRequest, res, next) => {
    const { content } = req.body as CreateCommentBody
    const { postId } = req.params
    const authenticatedUserId= req.userId

    try {
        if(!postId) {
            throw createHttpError(400, "Bad request, missing param")
        }

        if(!authenticatedUserId){
            throw createHttpError(403, "Forbidden, unauthorized to create a post")
        }

        if(!content) {
            throw createHttpError(400, "Bad request, comment missing")
        }
        const newComment = CommentModel.create({
            creator: authenticatedUserId,
            content,
            post_id : postId
        })

        res.status(201).json(newComment)
    } catch (error) {
        next(error)   
    }
} 

export const getPostComments: RequestHandler<CommentParams> = async (req, res, next) => {
    const { postId } = req.params

    try {
        if(!postId){
            throw createHttpError()
        }
        const comments = await CommentModel.find({post_id: postId}).populate("creator").exec()

        if(!comments){
            throw createHttpError(404, "Comments not found")
        }

        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}


export const deleteComment: RequestHandler<DeleteCommentParams> = async (req: CustomRequest, res, next) => {
    const authenticatedUserId = req.userId
    const { commentId } = req.params

    try {
        const comment = await CommentModel.findById(commentId).exec()

        if(!comment) {
            throw createHttpError(404, "Comment not found")
        }

        if(authenticatedUserId){
            if(!comment.creator.equals(authenticatedUserId)){
                throw createHttpError(403, "Forbidden, unauthorized to delete a comment")
            }
        }

        await comment.deleteOne()

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}


