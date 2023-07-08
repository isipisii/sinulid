import { RequestHandler } from "express"
import PostModel from "../models/post"
import mongoose from "mongoose"
import createHttpError from "http-errors"

type CreatePostBody = {
    creator: string
    content: string
    image?: string | null
}

// test
export const createPost: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async (req, res, next) => {
    const { creator, content, image  } = req.body

    try {
        const newPost = await PostModel.create({
            creator: creator,
            content: content,
            image: image
        })

        res.status(201).json(newPost);
    } catch (error) {
        next(error)
    }
}