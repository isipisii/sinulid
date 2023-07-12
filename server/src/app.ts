import express, {
  Request,
  Response,
  NextFunction,
  Application,

} from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import "dotenv/config"
import postRoutes from "./routes/postRoutes"
import userRoutes from "./routes/userRoutes"
import  jwt, {VerifyErrors} from "jsonwebtoken"
import env from "./util/validateEnv"
import cors from "cors"
import cloudinary from "cloudinary"

export interface CustomRequest extends Request {
  userId?: string; // adding the userId property to the Request interface
}

// Middlewares
const app: Application = express();

app.use(cors())
app.use(morgan("dev"));
// for verifying the token returned by the client
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
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
})
app.use(express.json())

cloudinary.v2.config({ 
  cloud_name: env.CLOUD_NAME, 
  api_key: env.CLOUDINARY_API_KEY, 
  api_secret: env.CLOUDINARY_SECRET 
});


app.use("/posts", postRoutes)
app.use("/users", userRoutes)

app.use((res, req, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// error middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMess = "An unknown error occurred";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMess = error.message;
  }
  res.status(statusCode).json({ error: errorMess });
});

export default app;
