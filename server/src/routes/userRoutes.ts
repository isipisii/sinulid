import * as UserControllers from "../controllers/userControllers";
import express from "express";

const router = express.Router();

router.post("/sign-in", UserControllers.signUp)

router.get("/", UserControllers.getUserInfo)

router.post("/log-in", UserControllers.logIn)

export default router