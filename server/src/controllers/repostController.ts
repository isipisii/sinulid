import { RequestHandler } from "express";
import RepostModel from "../models/repost"
import createHttpError from "http-errors"
import { CustomRequest } from "../app";

type RepostParam = {
    postId: string
}

type DeleteRepostParam = {
    repostId: string
}

type GetRepostParam = {
    userId: string
}

export const createRepost: RequestHandler<RepostParam> = async (req: CustomRequest, res, next) => {
    const { postId } =  req.params
    const authenticatedUserId = req.userId

    

    if(!postId){
        throw createHttpError(400, "Bad request, missing parameter")
    }

    if(!authenticatedUserId){
        throw createHttpError(403, "Forbidden, unauthorized to repost a post")
    }

    try {
        const newRepost = await RepostModel.create({
            repost_creator: authenticatedUserId,
            post: postId
        })
        
        const populatedNewRepost = await RepostModel.populate(newRepost, [
            {
                path: "post",
                select: "-updatedAt",
                populate: [
                    { path: "creator" }, 
                    { path: "liked_by" },
                    { 
                        path: "parent",
                        populate: ["creator", "children", "liked_by", {path: "parent", populate: "creator"}]
                    },
                    {
                        path:"children",
                        populate: "creator"
                        
                    }
                ],
            },
            { path: "repost_creator" },
        ]);


        res.status(201).json(populatedNewRepost)
    } catch (error) {
        next(error)
    }
} 


export const deleteRepost: RequestHandler<DeleteRepostParam> = async (req: CustomRequest, res, next) => {
    const { repostId } = req.params
    const authenticatedUserId = req.userId

    try {
        if(!repostId){
            throw createHttpError(400, "Bad request, missing parameter")
        }

        const repost = await RepostModel.findById(repostId).exec()

        if(!repost){
            throw createHttpError(404, "Repost not found")
        }

        if(authenticatedUserId){
            if(!repost.repost_creator.equals(authenticatedUserId)){
                throw createHttpError(403, "Forbidden, unauthorized to remove a post")
            }  
        }

        await repost.deleteOne()

        res.sendStatus(204)
    } catch (error) {
        next(error)   
    }
}
