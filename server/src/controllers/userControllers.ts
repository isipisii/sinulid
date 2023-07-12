import { RequestHandler, raw } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken"
import env from "../util/validateEnv"
import { CustomRequest } from "../app";
import cloudinary from "cloudinary"
import post from "../models/post";

type SignUpBody = { 
    username: string
    email: string
    password: string
}

type LogInBody = {
    email: string
    password: string
}

type UpdateUserInfoParam = {
    userId: string
}

type UpdateUserInfoBody = {
    bio: string
    link: string
}

// account sign up
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email, password: rawPassword } = req.body
    

    try {   
            // error handlers
            if(!username || !email || !rawPassword){
                throw createHttpError(400, "Missing credentials")
            }
            
            const existingUsername = await UserModel.findOne({ username }).exec()
            
            if(existingUsername){
                throw createHttpError(409, "This username is already taken, please use different one.")
            }

            const existingEmail = await UserModel.findOne({ email }).exec()
            
            if(existingEmail){
                throw createHttpError(409, "This email is already taken, please use different one.")
            }

            //password hashing
            const hashedPassword = await bcrypt.hash(rawPassword, 10)

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword
            })
            
            // this token will be sent to the client once the creation of user is done
            jwt.sign({ userId: newUser._id}, env.JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
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

            // this token will be sent to the client once the user logged in
            jwt.sign({ userId: user._id}, env.JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
                if(error) next(error)
                res.status(201).json({ token: token })
            })

        } catch (error) {
            next(next)
        }
}

// this will get the user info once their is a token
export const getUserInfo: RequestHandler = async(req: CustomRequest, res, next) => {
    try {
        const user = await UserModel.findById(req.userId).exec()
        res.status(201).json(user)
    } catch (error) {
        next()
    }
}

export const updateUserInfo: RequestHandler<UpdateUserInfoParam, unknown, UpdateUserInfoBody, unknown> = async (req: any, res, next) => {
    const { userId } = req.params
    const { bio, link } = req.body
    const newImageFile = req.file?.path
    let newImageResult: any;

    try {
        const user = await UserModel.findById(userId).exec()
        const currentCloudinaryId = user?.displayed_picture?.cloudinary_id

        if(!user){
            throw createHttpError(404, "User not found!")
        }

        if(currentCloudinaryId && newImageFile){
            await cloudinary.v2.api.delete_resources([currentCloudinaryId]);
            newImageResult = await cloudinary.v2.uploader.upload(newImageFile)
        } else if(newImageFile){
            newImageResult = await cloudinary.v2.uploader.upload(newImageFile)
        }

        user.bio = bio
        user.link = link
        user.displayed_picture = {
            url: newImageResult.secure_url || user.displayed_picture?.url,
            cloudinary_id: newImageResult.public_id || user.displayed_picture?.cloudinary_id
        }

        const updatedUser = await user.save()

        res.status(200).json(updatedUser)

    } catch (error) {
        next(error)
    }
}