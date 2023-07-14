import * as PostControllers from "../controllers/postControllers"
import  express from "express";
import upload from "../util/multer"

const router = express.Router()

router.post("/", upload.single("image"), PostControllers.createPost);

router.patch("/update/:postId", upload.single("image"), PostControllers.updatePost)

router.get("/user-posts/:userId", PostControllers.getUserPosts)

router.get("/", PostControllers.getPosts)

router.delete("/remove/:postId", PostControllers.deletePost)

router.get("/likes/:postId", PostControllers.checkIfUserLikes)

router.patch("/like/:postId", PostControllers.likePost)

router.patch("/unlike/:postId", PostControllers.unlikePost)

export default router 