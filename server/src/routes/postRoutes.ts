import * as PostControllers from "../controllers/postControllers"
import  express from "express";
import upload from "../util/multer"

const router = express.Router()

router.post("/", upload.single("image"), PostControllers.createPost);

router.patch("/update/:postId", upload.single("image"), PostControllers.updatePost)

router.get("/user-posts/:userId", PostControllers.getUserPosts)

router.get("/", PostControllers.getPosts)

router.get("/:postId", PostControllers.getSinglePost)

router.delete("/remove/:postId", PostControllers.deletePost)

router.patch("/like/:postId", PostControllers.likePost)

router.patch("/unlike/:postId", PostControllers.unlikePost)

router.post("/post-reply/:postId", upload.single("image"), PostControllers.createPostReply)

router.get("/post-reply/:postId", PostControllers.getPostReplies)

router.get("/user-replies/:userId", PostControllers.getUserReplies)

export default router 