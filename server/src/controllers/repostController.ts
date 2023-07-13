import { RequestHandler } from "express";
import RepostModel from "../models/repost"
import createHttpError from "http-errors"

type RepostParam = {
    userId: string
    postId: string
}

type DeleteRepostParam = {
    repostId: string
}

type GetRepostParam = {
    userId: string
}

export const createRepost: RequestHandler<RepostParam> = async (req, res, next) => {
    const { userId, postId } =  req.params
    
    if(!userId || !postId){
        throw createHttpError(400, "Bad request, missing parameter")
    }

    try {
        const newRepost = await RepostModel.create({
            repost_creator: userId,
            post_id: postId
        })

        res.status(201).json(newRepost)
    } catch (error) {
        next(error)
    }
} 

export const getUserReposts: RequestHandler<GetRepostParam, unknown, unknown, unknown> = async (req, res, next) => {
    const { userId } = req.params

    try {
        if(!userId){
            throw createHttpError(400, "Bad request, missing params")
        }
        
        const reposts = await RepostModel.find({repost_creator: userId}).populate("repost_creator").populate("post_id")
        
        if(!reposts){
            throw createHttpError(404, "Reposts not found")
        }
        
        res.status(200).json(reposts)
    } catch (error) {
        next(error)
    }
}

export const removeRepost: RequestHandler<DeleteRepostParam> = async (req, res, next) => {
    const { repostId } = req.params

    if(!repostId){
        throw createHttpError(400, "Bad request, missing parameter")
    }

    try {
        await RepostModel.findByIdAndRemove(repostId)

        res.sendStatus(204)
    } catch (error) {
        next(error)   
    }
}