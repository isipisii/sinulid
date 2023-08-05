import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMess = "An unknown error occurred";
    let statusCode = 500;
  
    if (isHttpError(error)) {
      statusCode = error.status;
      errorMess = error.message;
    }
    res.status(statusCode).json({ error: errorMess });
}