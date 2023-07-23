import * as CommentControllers from "../controllers/replyControllers";
import express from "express";

const router = express.Router();

router.post("/create/:postId", CommentControllers.createReply)

router.get("/:postId", CommentControllers.getPostReplies)

router.delete("/remove/:replyId", CommentControllers.deleteReply)

export default router