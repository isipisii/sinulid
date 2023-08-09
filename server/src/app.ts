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
import repostRoutes from "./routes/repostRoutes"
import { authHandler } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";
import env from "./util/validateEnv"
import cors from "cors"
import cloudinary from "cloudinary"

export interface CustomRequest extends Request {
  userId?: string; // adding the userId property to the Request interface
}

const app: Application = express();

app.use(cors())
app.use(morgan("dev"));

//auth middleware for verifying the token returned by the client
app.use(authHandler)

app.use(express.json())

cloudinary.v2.config({ 
  cloud_name: env.CLOUD_NAME, 
  api_key: env.CLOUDINARY_API_KEY, 
  api_secret: env.CLOUDINARY_SECRET 
});

app.use("/posts", postRoutes)
app.use("/users", userRoutes)
app.use("/reposts", repostRoutes)

// middleware for non existing endpoint
app.use((res, req, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// error middleware
app.use(errorHandler);

export default app;
