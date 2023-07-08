import * as PostControllers from "../controllers/postControllers"
import  express from "express";

const router = express.Router()

router.post("/new", PostControllers.createPost);

export default router 