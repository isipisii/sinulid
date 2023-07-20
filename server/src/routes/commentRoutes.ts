import * as CommentControllers from "../controllers/commentControllers";
import express from "express";

const router = express.Router();

router.post("/create/:postId", CommentControllers.createComment)

router.get("/:postId", CommentControllers.getPostComments)

router.delete("/remove/:commentId", CommentControllers.deleteComment)

export default router