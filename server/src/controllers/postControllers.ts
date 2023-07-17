import { RequestHandler } from "express"
import PostModel from "../models/post"
import mongoose from "mongoose"
import createHttpError from "http-errors"
import cloudinary from "cloudinary"
import { CustomRequest } from "../app"

export type CreatePostBody = {
    content: string
}

export type UpdatePostBody = {
    content: string,
    image?: string
}

type PostParam = {
    postId: string
}

type GetUserPostsParam = {
    userId: string
}

// create post
// NEEDS AUTHENTICATED USER IN ORDER TO ACCESS THIS
export const createPost: RequestHandler = async (req: CustomRequest, res, next) => {
    const { content } = req.body as CreatePostBody
    const authenticatedCreator = req.userId

    if(!authenticatedCreator){
        throw createHttpError(403, "Forbidden, unauthorized to create a post")
    }
    
    if(!content){ 
        throw createHttpError(400, "Bad request, post should have content")
    }

    try {
        let image = null;

        if (req.file) {
            const imageResult: any = await cloudinary.v2.uploader.upload(req.file.path)
            image = {
                url: imageResult.secure_url,
                cloudinary_id: imageResult.public_id,
            };
        }
        
        const newPost = await PostModel.create({
            creator: authenticatedCreator,
            content,
            image
        })
        await newPost.populate("creator")

        res.status(201).json(newPost);
    } catch (error) {
        next(error)
    }
}

// get all post 
export const getPosts: RequestHandler = async (req, res, next) => {
        try {
            // gets post in descending order
            const posts = await PostModel.find().sort({ createdAt: -1}).populate("creator").populate("liked_by").exec();
            res.status(200).json(posts);
        } catch (error) {
            next(error)
        }
}

// get user's post
export const getUserPosts: RequestHandler<GetUserPostsParam> = async (req, res, next) => {
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
// NEEDS AUTHENTICATED USER IN ORDER TO ACCESS THIS
export const updatePost: RequestHandler<PostParam> = async (req: CustomRequest, res, next) => {
    const  { content } = req.body as UpdatePostBody
    const { postId } = req.params
    const authenticatedUserId = req.userId
    const newImageFile = req.file?.path
    let newImageResult: any ;

    try {
        let image = null

        if(!content){
            throw createHttpError(400, "Bad request, post should have content")
        }
        
        const post = await PostModel.findById(postId).exec()
        const currentCloudinaryId = post?.image?.cloudinary_id

        if(!post){
            throw createHttpError(404, "Post not found")    
        }

        if(authenticatedUserId){
            if (!post.creator.equals(authenticatedUserId)) {
                throw createHttpError(403, "Forbidden, unauthorized to delete the post");
            }
        } 
        
        // this will only work if the req has a file to upload
        if(req.file){
            /* checks if there is a current image in the document and if the user has a new image, then the current image will be
            deleted and the new image will be added */
            if(currentCloudinaryId && newImageFile){
                await cloudinary.v2.api.delete_resources([currentCloudinaryId]);
                newImageResult = await cloudinary.v2.uploader.upload(newImageFile)
                image = {
                    url: newImageResult.secure_url,
                    cloudinary_id: newImageResult.public_id
                }
            } else if(newImageFile){
                newImageResult = await cloudinary.v2.uploader.upload(newImageFile)
                image = {
                    url: newImageResult.secure_url,
                    cloudinary_id: newImageResult.public_id
                }
            }
        } 

        post.content = content
        post.image = {
            url: image?.url || post?.image?.url,
            cloudinary_id: image?.cloudinary_id || post?.image?.cloudinary_id
        }
        const updatedPost = await post.save()

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error)
    }
}

// delete post
// NEEDS AUTHENTICATED USER IN ORDER TO ACCESS THIS
export const deletePost: RequestHandler<PostParam> = async (req: CustomRequest, res, next) => {
    const postId = req.params.postId
    const authenticatedUserId = req.userId

    try {     
        const post = await PostModel.findById(postId).exec()

        if (!post) {
            throw createHttpError(404, "Post not found");
        }

        if(authenticatedUserId){
            if (!post.creator.equals(authenticatedUserId)) {
                throw createHttpError(403, "Forbidden, unauthorized to delete the post");
            }
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
// NEEDS AUTHENTICATED USER IN ORDER TO ACCESS THIS
export const likePost: RequestHandler<PostParam> = async (req: CustomRequest, res, next) => {
    const { postId } = req.params
    const authenticatedUserId = req.userId

    try {  
        const post = await PostModel.findById(postId).exec()   

        if(!authenticatedUserId){
            throw createHttpError(403, "Forbidden, unauthorized to like a post")
        }

        if(!post) {
            throw createHttpError(404, "Post not found")
        }
        
        const didLike = post.liked_by.some((user) => user.equals(new mongoose.Types.ObjectId(authenticatedUserId)));
    
        if(didLike){
            throw createHttpError(400, "User already liked the post")
        } 
        
        post.likes += 1
        post.liked_by.push(new mongoose.Types.ObjectId(authenticatedUserId))

        await post.save()

        res.status(200).json("Post liked")
    } catch (error) {
        next(error)
    }
}

// NEEDS AUTHENTICATED USER IN ORDER TO ACCESS THIS
export const unlikePost: RequestHandler<PostParam> = async (req: CustomRequest, res, next) => {
    const { postId } = req.params
    const authenticatedUserId = req.userId
    
    try {  
        const post = await PostModel.findById(postId).exec()   
        
        if(!authenticatedUserId){
            throw createHttpError(403, "Forbidden, unauthorized to unlike a post")
        }

        if(!post) {
            throw createHttpError(404, "Post not found")
        }
        
        const didlike = post.liked_by.some((user) => user.equals(new mongoose.Types.ObjectId(authenticatedUserId)));
        
        if(!didlike){
            throw createHttpError(400, "User already unliked the post")
        } 

        post.likes -= 1
        post.liked_by = post.liked_by.filter((user) => !user.equals(new mongoose.Types.ObjectId(authenticatedUserId)));

        await post.save()

        res.status(200).json("Post unliked")
    } catch (error) {
        next(error)
    }
}

// NEEDS AUTHENTICATED USER IN ORDER TO ACCESS THIS
export const checkIfUserLikes: RequestHandler<PostParam> = async (req: CustomRequest, res, next) => {
    const { postId } = req.params;
    const authenticatedUserId = req.userId

    try {
        const post = await PostModel.findById(postId).exec();

        if(!authenticatedUserId){
            throw createHttpError(403, "Forbidden, unauthorized to check if the user likes the post")
        }
        
        if (!post) {
            throw createHttpError(404, "Post not found");
        }
        
    const didLike = post.liked_by.some((likedUserId) => likedUserId.equals(new mongoose.Types.ObjectId(authenticatedUserId)));

    res.json(didLike);
    } catch (error) {
        next(error);
    }
};