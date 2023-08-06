import { RequestHandler } from "express"
import ReplyModel from "../models/reply"
import { CustomRequest } from "../app"
import createHttpError from "http-errors"
import cloudinary from "cloudinary"

type CreateReplyBody = {
    content: string
}

type ReplyParams ={
    postId: string
}

type DeleteReplyParams = {
    replyId: string
}

type UserRepliesParams = {
    userId: string
}

export const createReply: RequestHandler<ReplyParams> = async(req: CustomRequest, res, next) => {
    const { content } = req.body as CreateReplyBody
    const { postId } = req.params
    const authenticatedUserId= req.userId

    try {
        let image = null

        if(!postId) {
            throw createHttpError(400, "Bad request, missing param")
        }

        if(!authenticatedUserId){
            throw createHttpError(403, "Forbidden, unauthorized to create a post")
        }

        if(!content) {
            throw createHttpError(400, "Bad request, reply missing")
        }
        
        if(req.file){
            const imageResult: any = await cloudinary.v2.uploader.upload(req.file.path)
            image = {
                url: imageResult.secure_url,
                cloudinary_id: imageResult.public_id,
            }
        }

        const newReply = await ReplyModel.create({
            creator: authenticatedUserId,
            content,
            post: postId,
            image
        })

        await newReply.populate("creator")
        
        res.status(201).json(newReply)
    } catch (error) {
        next(error)   
    }
} 

// collect all of the replies of the user
export const getUserReplies: RequestHandler<UserRepliesParams> = async (req, res, next) => {
    const { userId } = req.params 

    try {
        if(!userId) {
            throw createHttpError(400, "Bad request missing params")
        }

        const userReplies = await ReplyModel.find({creator: userId}).populate(["creator", "post", "parent_reply"]).exec()

        if(!userReplies){
            throw createHttpError(404, "Replies not found")
        }

        res.status(201).json(userReplies)
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


