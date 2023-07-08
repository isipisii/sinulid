import { RequestHandler, raw } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken"
import env from "../util/validateEnv"
import { CustomRequest } from "../app";

type SignUpBody = { 
    username: string
    email: string
    password: string
}

type LogInBody = {
    email: string
    password: string
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
                res.status(201).json({ token })
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

            // this token will be sent to the client once the creation of user is done
            jwt.sign({ userId: user._id}, env.JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
                if(error) next(error)
                res.status(201).json({ token })
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