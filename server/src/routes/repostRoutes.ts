import * as RepostControllers from "../controllers/repostController"
import express from "express"

const router = express.Router()

router.post("/create/:postId", RepostControllers.createRepost)

router.delete("/remove/:repostId", RepostControllers.deleteRepost)

export default router