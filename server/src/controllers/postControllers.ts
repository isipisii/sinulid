import { RequestHandler } from "express"
import PostModel from "../models/post"
import mongoose, { Types } from "mongoose"
import createHttpError from "http-errors"
import cloudinary from "cloudinary"

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

type LikePostBody = {
    userId: string
}

// create post
export const createPost: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async (req: any, res, next) => {
    const { creator, content } = req.body
    
    if(!creator){
        throw createHttpError(400, "Bad request, post should have creator")
    }
    
    if(!content){ 
        throw createHttpError(400, "Bad request, post should have content")
    }

    try {
        let image = null;

        if (req.file) {
            const imageResult: any = await cloudinary.v2.uploader.upload(req.file.path);
            image = {
                url: imageResult.secure_url,
                cloudinary_id: imageResult.public_id,
            };
        }
        const newPost = await PostModel.create({
            creator,
            content,
            image
        })

        res.status(201).json(newPost);
    } catch (error) {
        next(error)
    }
}

// get all post 
export const getPosts: RequestHandler = async (req, res, next) => {
        try {
            const posts = await PostModel.find().populate("creator").populate("liked_by").exec();
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
export const updatePost: RequestHandler<PostParam, unknown, UpdatePostBody, unknown> = async (req: any, res, next) => {
    const  { content } = req.body
    const { postId } = req.params
    const newImageFile = req.file?.path
    let newImageResult: any;

    try {
        if(!content){
            throw createHttpError(400, "Bad request, post should have content")
        }

        const post = await PostModel.findById(postId).exec()
        const currentCloudinaryId = post?.image?.cloudinary_id

        if(!post){
            throw createHttpError(404, "Post not found")    
        }

        /* checks if there is a current image in the document and if the user has a new image, then the current image will be
        deleted and the new image will be added */
        if(currentCloudinaryId && newImageFile){
            await cloudinary.v2.api.delete_resources([currentCloudinaryId]);
            newImageResult = await cloudinary.v2.uploader.upload(newImageFile)
        } else if(newImageFile){
            newImageResult = await cloudinary.v2.uploader.upload(newImageFile)
        }

        post.content = content
        post.image = {
            // retains the url and cloudinary if there is no new image
            url: newImageResult.secure_url || post.image?.url,
            cloudinary_id: newImageResult.public_id || post.image?.cloudinary_id
        }

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
        const post = await PostModel.findById(postId).exec()

        if(!post){
            throw createHttpError(404, "Post not found")
        }

        const cloudinaryId = post.image?.cloudinary_id

        if(cloudinaryId){
            await cloudinary.v2.api.delete_resources([cloudinaryId]);
        }   

        await post.deleteOne()

        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}

// like post
export const likePost: RequestHandler<PostParam, unknown, LikePostBody, unknown> = async (req, res, next) => {
    const { postId } = req.params
    const { userId } = req.body

    try {  
        const post = await PostModel.findById(postId).exec()   
        if(!post) {
            throw createHttpError(404, "Post not found")
        }

        const didLike = post.liked_by.some((user) => user.equals(userId));
    
        if(didLike){
            throw createHttpError(400, "User already liked the post")
        } 
        
        post.likes += 1
        post.liked_by.push(new mongoose.Types.ObjectId(userId))

        await post.save()

        res.status(200).json("Post liked")
    } catch (error) {
        next(error)
    }
}

export const unlikePost: RequestHandler<PostParam, unknown, LikePostBody, unknown> = async (req, res, next) => {
    const { postId } = req.params
    const { userId } = req.body
    
    try {  
        const post = await PostModel.findById(postId).exec()   

        if(!post) {
            throw createHttpError(404, "Post not found")
        }
        
        post.likes -= 1
        post.liked_by = post.liked_by.filter((user) => !user.equals(userId));

        await post.save()

        res.status(200).json("Post unliked")
    } catch (error) {
        next(error)
    }
}

export const checkIfUserLikes: RequestHandler<PostParam, unknown, LikePostBody, unknown> = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId).exec();
        if (!post) {
            throw createHttpError(404, "Post not found");
        }
        
    const didLike = post.liked_by.some((likedUserId) => likedUserId.equals(userId));

    res.json(didLike);
    } catch (error) {
        next(error);
    }
};