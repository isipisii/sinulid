import { RequestHandler } from "express"
import PostModel from "../models/post"
import mongoose from "mongoose"
import createHttpError from "http-errors"

type CreatePostBody = {
    creator: string
    content: string
    image?: string | null
}

type UpdatePostBody = {
    content: string,
    image?: string
}

type PostParam = {
    postId: string
}

type UserIdParam = {
    userId: string
}


// create post
export const createPost: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async (req, res, next) => {
    const { creator, content, image  } = req.body
    
    if(!creator){
        throw createHttpError(400, "Bad request, post should have creator")
    }
    
    if(!content){
        throw createHttpError(400, "Bad request, post should have content")
    }

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

// get all post 
export const getPosts: RequestHandler = async (req, res, next) => {
        try {
            const posts = await PostModel.find()

            res.status(200).json(posts);
        } catch (error) {
            next(error)
        }
}

// get user's post
export const getUserPosts: RequestHandler<UserIdParam, unknown, unknown, unknown> = async (req, res, next) => {
    const userId = req.params.userId

    try {

        if(!userId){
            throw createHttpError(400, "Bad request, missing params")
        }

        const userPosts = await PostModel.find({ creator: userId }).populate("creator")

        if(!userPosts){
            throw createHttpError(404, "Posts not found")
        }  
        
        res.status(200).json(userPosts)

    } catch (error) {
        next(error)
    }
} 

// update post
export const updatePost: RequestHandler<PostParam, unknown, UpdatePostBody, unknown> = async (req, res, next) => {
    const  { content, image } = req.body
    const postId = req.params.postId

    try {
        if(!content){
            throw createHttpError(400, "Bad request, post should have content")
        }

        const post = await PostModel.findById(postId).exec()

        if(!post){
            throw createHttpError(404, "Post not found")    
        }

        post.content = content
        post.image = image as string
    
        const updatedPost = await post.save()

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error)
    }
}


// delete post
export const deletePost: RequestHandler<PostParam> = async (req, res, next) => {
    const postId = req.params.postId

    try {
        const deletePost = await PostModel.findByIdAndRemove(postId)

        if(!deletePost){
            throw createHttpError(404, "Post not found")
        }

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}