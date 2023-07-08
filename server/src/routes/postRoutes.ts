import * as PostControllers from "../controllers/postControllers"
import  express from "express";

const router = express.Router()

router.post("/", PostControllers.createPost);

router.patch("/:postId", PostControllers.updatePost)

router.get("/user-posts/:userId", PostControllers.getUserPosts)

router.get("/", PostControllers.getPosts)

router.delete("/:postId", PostControllers.deletePost)

export default router 