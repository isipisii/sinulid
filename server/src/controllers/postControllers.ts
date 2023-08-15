import { RequestHandler } from "express"
import PostModel from "../models/post"
import mongoose from "mongoose"
import createHttpError from "http-errors"
import cloudinary from "cloudinary"
import { CustomRequest } from "../app"
import RepostModel from "../models/repost"

export type CreatePostOrReplyBody = {
    content: string
}

export type UpdatePostBody = {
    content: string,
    image?: string
}

type PostParam = {
    postId: string
}

type GetUserPostsOrRepliesParam = {
    userId: string
}


// create post
// NEEDS AUTHENTICATED USER IN ORDER TO ACCESS THIS
export const createPost: RequestHandler = async (req: CustomRequest, res, next) => {
    const { content } = req.body as CreatePostOrReplyBody
    const authenticatedUserId = req.userId

    if(!authenticatedUserId){
        throw createHttpError(403, "Forbidden, unauthorized to create a post")
    }

    if(!content && !req.file?.path){
        throw createHttpError(400, "Bad request, post should have a content or image")
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
            creator: authenticatedUserId,
            content,
            image
        })
        await newPost.populate("creator")

        res.status(201).json(newPost);
    } catch (error) {
        next(error)
    }
}

export const getSinglePost: RequestHandler<PostParam> = async (req, res, next) => {
    const postId = req.params.postId
    try {
        if(!postId){
            throw createHttpError(400, "Bad request, missing params")
        }

         const post = await PostModel.findById(postId).populate([
            { path: "creator" }, 
            { path: "liked_by" },
            { 
                path: "parent",
                populate: ["creator", "children", "liked_by" ]
            },
            {
                path:"children",
                populate: "creator"
            }
        ]).exec()

        res.status(200).json(post)
    } catch (error) {
        next(error)
    }
}

// get all post 
export const getPosts: RequestHandler = async (req, res, next) => {
    try {
        // gets post in descending order
        const posts = await PostModel.find({parent: null}).sort({ createdAt: -1}).populate([
            { path: "creator" }, 
            { path:"liked_by" },
            {
                path:"children",
                populate: "creator"
            }
        ]).exec();
        
        res.status(200).json(posts);
    } catch (error) {
        next(error)
    }
}

// get user's post
export const getUserPosts: RequestHandler<GetUserPostsOrRepliesParam> = async (req, res, next) => {
    const userId = req.params.userId

    try {
        if(!userId){
            throw createHttpError(400, "Bad request, missing params")
        }

        const userPosts = await PostModel.find({ creator: userId, parent: null }).sort({ createdAt: -1}).populate("liked_by").populate("creator").exec()

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

        if(!content && !newImageFile){
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

        await updatedPost.populate([
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
        ])
        
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

        // if the reply/post has a parent field, then find the parent and remove the id of this post from the children field of parent
        if(post.parent){
            const parentPost = await PostModel.findById(post.parent).exec()

            if(!parentPost){
                throw createHttpError(404, "Parent post not found");
            }

            parentPost.children = parentPost?.children.filter((childPost) => !childPost.equals(postId))

            await parentPost.save();
        }

        //will recursively delete post and its children as long as there is a child post
        async function deletePostAndChildren(post: any) {
            for (const childId of post.children) {
                const childPost = await PostModel.findById(childId).exec();
                if (childPost) {
                    await deletePostAndChildren(childPost);
                }
            }

            if (post.image?.cloudinary_id) {
                await cloudinary.v2.api.delete_resources([post.image.cloudinary_id]);
            }

            // delete associated repost documents
            await RepostModel.deleteMany({ post: post._id });
            await PostModel.deleteOne({ _id: post._id });
        }

        await deletePostAndChildren(post);

        res.status(204).json(post)
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
        
        post.liked_by = post.liked_by.filter((user) => !user.equals(new mongoose.Types.ObjectId(authenticatedUserId)));

        await post.save()

        res.status(200).json("Post unliked")
    } catch (error) {
        next(error)
    }
}

export const createPostReply: RequestHandler<PostParam> = async (req: CustomRequest, res, next) => {
    const authenticatedUserId = req.userId
    const { content } = req.body as CreatePostOrReplyBody
    const { postId: parentId } = req.params

    try {
        let image = null;

        const originalPost = await PostModel.findById(parentId).exec()

        if(!originalPost){
            throw createHttpError(404, "Post not found")
        }

        if(!content && !req.file?.path){
            throw createHttpError(400, "Bad request, reply should have a content or image")
        }
        
        if (req.file) {
            const imageResult: any = await cloudinary.v2.uploader.upload(req.file.path)
            image = {
                url: imageResult.secure_url,
                cloudinary_id: imageResult.public_id,
            };
        }

        const newPostReply = await PostModel.create({
            creator: authenticatedUserId,
            content,
            image,
            parent: parentId
        })

        originalPost.children.push(newPostReply._id)

        await originalPost.save()

        await newPostReply.populate("creator")

        res.status(201).json(newPostReply);
    } catch (error) {
        next(error)
    }
}

export const getPostReplies: RequestHandler<PostParam> = async (req, res, next) => {
    const { postId: parentId }  = req.params

    try {
        const postReplies = await PostModel.find({parent: parentId}).sort({ createdAt: -1}).populate([
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
        ]).exec()

        if(!postReplies){
            throw createHttpError(404, "Post replies not found")
        }

        res.status(201).json(postReplies)
    } catch (error) {
        next(error)
    }
}

export const getUserReplies: RequestHandler<GetUserPostsOrRepliesParam> = async (req, res, next) => {
    const userId = req.params.userId

    try {
        if(!userId){
            throw createHttpError(400, "Bad request, missing params")
        }
        // get the posts that has not null parent field
        const userReplies = await PostModel.find({ creator: userId, parent: {$ne: null} }).sort({ createdAt: -1}).populate([
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
        ]).exec()

        if(!userReplies){
            throw createHttpError(404, "Replies not found")
        }  
        
        res.status(200).json(userReplies)
    } catch (error) {
        next(error)
    }
} 