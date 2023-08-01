import * as UserControllers from "../controllers/userControllers";
import express from "express";
import upload from "../util/multer"

const router = express.Router();

router.post("/signup", UserControllers.signUp)

router.get("/", UserControllers.getAuthenticatedUserInfo)

router.get("/:username", UserControllers.getUserInfo)

router.post("/login", UserControllers.logIn)

router.patch("/update", upload.single("image"), UserControllers.updateUserInfo)

router.patch("/follow/:userId", UserControllers.followUser)

router.patch("/unfollow/:userId", UserControllers.unfollowUser)

export default router