import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import PostModel from "../models/post"
import RepostModel from "../models/repost"
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken"
import env from "../util/validateEnv"
import { CustomRequest } from "../app";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

type SignUpBody = { 
    username: string
    email: string
    password: string
    name: string
}

type LogInBody = {
    email: string
    password: string
}

export type UpdateUserInfoBody = {
    bio: string
    link: string
    username: string
    name:string
}

type GetUserInfoParam = {
    username: string
}

type FollowAndUnfollowParam = {
    userId: string
}

type GetUserPostsAndReposts = {
    userId: string
}

type SearchUserQuery = {
    user: string
}

// account sign up
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email, password: rawPassword, name } = req.body
    
    try { 
        // error handlers
        if(!username || !email || !rawPassword || !name){
            throw createHttpError(400, "Missing credentials")
        }
        
        const existingUsername = await UserModel.findOne({ username }).exec()
        
        if(existingUsername){
            throw createHttpError(409, "This username is already taken, please use different one.")
        }

        //password hashing
        const hashedPassword = await bcrypt.hash(rawPassword, 10)

        const newUser = await UserModel.create({
            username,
            email,
            name,
            password: hashedPassword
        })
        
        // this token will be sent to the client once the creation of user is done
        jwt.sign({ userId: newUser._id}, env.JWT_SECRET, { expiresIn: "1d" }, (error, token) => {
            if(error) next(error)
            res.status(201).json({ token: token })
        })

    } catch (error) {
        next(error)
    }
}


export const logIn: RequestHandler<unknown, unknown, LogInBody, unknown> = async (req, res, next) => {
    const { email, password: rawPassword } = req.body

        try {
            if(!email || !rawPassword) {
                throw createHttpError(400, "Missing credentials");
            }    
            
            const user = await UserModel.findOne({ email }).select("+password").exec()
            
            if(!user){
                throw createHttpError(401, "Invalid credentials")
            }

            const passwordMatch = await bcrypt.compare(rawPassword, user.password)

            if(!passwordMatch) {
                throw createHttpError(401, "Invalid credentials")
            }

            // this token will be sent to the client once the user successfully logged in
            jwt.sign({ userId: user._id}, env.JWT_SECRET, { expiresIn: "1d" }, (error, token) => {
                if(error) next(error)
                res.status(201).json({ token: token })
            })

        } catch (error) {
            next(error)
        }
}

// this will get the user info once their is a token
export const getAuthenticatedUserInfo: RequestHandler = async(req: CustomRequest, res, next) => {
    const authenticatedUserId = req.userId

    try {
        if(!authenticatedUserId){
            throw createHttpError(403, "Forbidden, unauthorized to get user info")
        }
        const user = await UserModel.findById(authenticatedUserId).select("+email").exec()
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

export const getUserInfo: RequestHandler<GetUserInfoParam> = async (req, res, next) => {
    const username = req.params.username

    try {
        if(!username) {
            throw createHttpError(400, "Bad request, missing params")
        }

        const user = await UserModel.findOne({ username }).populate("followers").exec()
        res.status(201).json(user)

    } catch (error) {
        next(error)
    }
}

export const updateUserInfo: RequestHandler = async (req: CustomRequest , res, next) => {
    const authenticatedUserId = req.userId 
    const { bio, link, username, name } = req.body as UpdateUserInfoBody
    const newImageFile = req.file?.path
    let newImageResult: any;

    try {
        let image = null

        if(!name || !username){
            throw createHttpError(400, "Bad request, username and name are required");
        }

        if(!authenticatedUserId){
            throw createHttpError(403, "Forbidden, unauthorized to update user info")
        } 
        
        const user = await UserModel.findById(authenticatedUserId).exec()
        const currentCloudinaryId = user?.displayed_picture?.cloudinary_id

        if(!user){
            throw createHttpError(404, "User not found")
        }
        // will throw an error if the existing user's username is already taken by a different user
        //and so that it wont throw an error if the user updated his/her profile without changing the username
        if(user.username === username && user._id.toString() !== authenticatedUserId && authenticatedUserId){
            throw createHttpError(409, "This username is already taken, please use different one.")
        }

        if(req.file){
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

        user.username = username || user.username
        user.name = name || user.name
        user.bio = bio !== null ? bio : user.bio;
        user.link = link !== null ? link : user.link;
        user.displayed_picture = {
            url: image?.url || user.displayed_picture?.url,
            cloudinary_id: image?.cloudinary_id || user.displayed_picture?.cloudinary_id
        }

        const updatedUser = await user.save()

        res.status(200).json(updatedUser)

    } catch (error) {
        next(error)
    }
}


export const followUser: RequestHandler<FollowAndUnfollowParam> = async (req: CustomRequest, res, next) => {
    const { userId: userToFollowId } = req.params;
    const authenticatedFollowerId = req.userId;

    try {
        const userToFollow = await UserModel.findById(userToFollowId).exec();
        const authenticatedFollower = await UserModel.findById(authenticatedFollowerId).exec();

        if (!authenticatedFollowerId) {
            throw createHttpError(403, "Forbidden, unauthorized to update user info");
        }

        if (!userToFollowId) {
            throw createHttpError(400, "Bad request, missing param");
        }

        if (userToFollowId === authenticatedFollowerId) {
            throw createHttpError(400, "Bad request, you cannot follow yourself");
        }

        if (!userToFollow) {
            throw createHttpError(404, "User not found");
        }

        if (!authenticatedFollower) {
            throw createHttpError(404, "User not found");
        }

        const isFollowing = userToFollow.followers.some(followerId => followerId.equals(new mongoose.Types.ObjectId(authenticatedFollowerId)));

        if (isFollowing) {
            throw createHttpError(400, "You already followed this user");
        }

        userToFollow.followers.push(new mongoose.Types.ObjectId(authenticatedFollowerId));
        authenticatedFollower.following.push(new mongoose.Types.ObjectId(userToFollowId));

        await authenticatedFollower.save()
        await userToFollow.save();

        res.sendStatus(201) 
    } catch (error) {
        next(error);
    }
};

export const unfollowUser: RequestHandler<FollowAndUnfollowParam> = async (req: CustomRequest, res, next) => {
    const { userId: userToUnfollowId } = req.params
    const authenticatedFollowerId = req.userId

    try {
        const userToUnfollow = await UserModel.findById(userToUnfollowId).exec()
        const authenticatedFollower = await UserModel.findById(authenticatedFollowerId).exec();

        if(!authenticatedFollowerId) {
            throw createHttpError(403, "Forbidden, unauthorized to update user info")
        }

        if(!userToUnfollowId) {
            throw createHttpError(400, "Bad request, missing param")
        }

        if(userToUnfollowId === authenticatedFollowerId){
            throw createHttpError(400, "Bad request, you cannot unfollow yourself")
        }

        if(!userToUnfollow){
            throw createHttpError(404, "User not found")
        }

        if (!authenticatedFollower) {
            throw createHttpError(404, "User not found");
        }


        const isFollowing = userToUnfollow.followers.some((followerId) => followerId.equals(new mongoose.Types.ObjectId(authenticatedFollowerId)))

        if(!isFollowing) throw createHttpError(400, "You already unfollowed this user")
        
        userToUnfollow.followers = userToUnfollow.followers.filter((followerId => !followerId.equals(new mongoose.Types.ObjectId(authenticatedFollowerId))))
        authenticatedFollower.following = authenticatedFollower.following.filter((followerId => !followerId.equals(new mongoose.Types.ObjectId(userToUnfollowId))))

        await userToUnfollow.save()
        await authenticatedFollower.save()

        res.sendStatus(201)
    } catch (error) {
        next(error)
    }   
}

export const getUserPostsAndReposts: RequestHandler<GetUserPostsAndReposts> = async (req, res, next) => {
    const { userId } = req.params

    try {
        if(!userId){
            throw createHttpError(400, "Bad request, missing param")
        }  
        
        const userPosts = await PostModel.find({ creator: userId, parent: null }).populate([
            { path: "creator" }, 
            { path:"liked_by" },
            {
                path:"children", // populate the creator of reply that are inside of children array field
                populate: "creator"
            }
        ]).exec()

        const userReposts = await RepostModel.find({ repost_creator: userId }).populate({
            path: "post",
            select: "-updatedAt",
            populate: [
                { path: "creator" }, 
                { path: "liked_by" },
                { 
                    path: "parent",
                    populate: "creator"
                },
                {
                    path:"children",
                    populate: "creator"
                    
                }
              ],
        }).populate("repost_creator").exec();
          

        if(!userReposts){
            throw createHttpError(404, "Reposts not found")
        }  

        if(!userPosts){
            throw createHttpError(404, "Posts not found")
        }  

        const combinedData = [...userPosts, ...userReposts];

        // sort the combined array by the time created in ascending order
        combinedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.status(201).json(combinedData)
    } catch (error) {
        next(error)
    }
}

export const searchUsers: RequestHandler<SearchUserQuery> = async (req, res, next) => {
    // const user = req.query  bug in query
    const { user } = req.params

    try {
        if (!user) {
            throw createHttpError(403, "Forbidden, unauthorized to get the random users")
        }
        const users = await UserModel.find({
          $or: [
            { username: { $regex: user, $options: 'i' } },
            { name: { $regex: user, $options: 'i' } },
          ],
        }).populate("followers")
    
        res.status(200).json(users);
      } catch (error) {
        next(error);
      }
};


export const getUsers: RequestHandler = async (req: CustomRequest, res, next) => { 
    const authenticatedUserId = req.userId

    try {
        if(!authenticatedUserId){
            throw createHttpError(403)
        }
        
        const authenticatedUser = await UserModel.findById(authenticatedUserId)

        if(!authenticatedUser){
            throw createHttpError(404, "User not found")
        }

        const populatedUsers = await UserModel.find({ username: {$ne: authenticatedUser.username } }).populate('followers').exec();
      
        res.status(200).json(populatedUsers);
    } catch (error) {
        next(error)
    }
}