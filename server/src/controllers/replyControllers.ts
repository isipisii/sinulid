import { RequestHandler } from "express"
import ReplyModel from "../models/reply"
import { CustomRequest } from "../app"
import createHttpError from "http-errors"

type CreateReplyBody = {
    content: string
}

type ReplyParams ={
    postId: string
}

type DeleteReplyParams = {
    replyId: string
}

export const createReply: RequestHandler<ReplyParams> = async(req: CustomRequest, res, next) => {
    const { content } = req.body as CreateReplyBody
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
            throw createHttpError(400, "Bad request, reply missing")
        }

        const newReply = await ReplyModel.create({
            creator: authenticatedUserId,
            content,
            post_id : postId
        })

        await newReply.populate("creator")
        
        res.status(201).json(newReply)
    } catch (error) {
        next(error)   
    }
} 

export const getPostReplies: RequestHandler<ReplyParams> = async (req, res, next) => {
    const { postId } = req.params

    try {
        if(!postId){
            throw createHttpError()
        }
        const replies = await ReplyModel.find({post_id: postId}).populate("creator").exec()

        if(!replies){
            throw createHttpError(404, "Replies not found")
        }

        res.status(200).json(replies)
    } catch (error) {
        next(error)
    }
}

export const deleteReply: RequestHandler<DeleteReplyParams> = async (req: CustomRequest, res, next) => {
    const authenticatedUserId = req.userId
    const { replyId } = req.params

    try {
        const reply = await ReplyModel.findById(replyId).exec()

        if(!reply) {
            throw createHttpError(404, "Reply not found")
        }

        if(authenticatedUserId){
            if(!reply.creator.equals(authenticatedUserId)){
                throw createHttpError(403, "Forbidden, unauthorized to delete a reply")
            }
        }

        await reply.deleteOne()

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}


