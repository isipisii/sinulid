import * as UserControllers from "../controllers/userControllers";
import express from "express";
import upload from "../util/multer"

const router = express.Router();

router.post("/sign-in", UserControllers.signUp)

router.get("/", UserControllers.getUserInfo)

router.post("/log-in", UserControllers.logIn)

router.patch("/update/:userId", upload.single("image"), UserControllers.updateUserInfo)

export default router