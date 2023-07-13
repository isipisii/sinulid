import * as RepostControllers from "../controllers/repostController"
import express from "express"

const router = express.Router()

router.get("/:userId", RepostControllers.getUserReposts)

router.post("/:userId/:postId", RepostControllers.createRepost)

router.delete("/remove/:repostId", RepostControllers.removeRepost)

export default router