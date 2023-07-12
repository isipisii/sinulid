import { RequestHandler } from "express"
import CommentModel from "../models/comment"
import mongoose from "mongoose"
import createHttpError from "http-errors"

type createCommentBody = {
    postId: string
    creator: string
    comment: string
}

type createCommentParams ={
    postId: string
}

export const createComment: RequestHandler<createCommentParams, unknown,  createCommentBody, unknown> = async(req, res, next) => {
    const { creator, comment } = req.body
    const { postId } = req.params

    try {

        if(creator || postId) {
            throw createHttpError(400, "Bad request, either you missed the post id or the creator id")
        }

        if(!comment) {
            throw createHttpError(400, "Bad request, comment missing")
        }
        const newComment = CommentModel.create({
            creator,
            comment,
            postId
        })

        res.status(201).json(newComment)
    } catch (error) {
        next(error)   
    }
} 

