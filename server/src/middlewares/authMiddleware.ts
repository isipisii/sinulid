import { CustomRequest } from "../app";
import  jwt, {VerifyErrors} from "jsonwebtoken"
import { NextFunction, Response } from "express";
import env from "../util/validateEnv"
import "dotenv/config"

export const authHandler = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
  
    if(token){
      jwt.verify(token, env.JWT_SECRET, (error: VerifyErrors | null, decoded: any) => {
        if (error) {
          return res.status(401).json({ error: "Invalid token" });
        }
        req.userId = decoded.userId;
        next();
      })
    } else {
      next()
    }
}

