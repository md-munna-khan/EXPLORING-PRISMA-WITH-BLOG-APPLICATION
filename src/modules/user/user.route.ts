import express from "express"
import { UserController } from "./user.controller"
const router = express.Router();

router.get(
    "/",
    UserController.getAllFromDB
)
router.post(
    "/",
    UserController.createUser
)
router.get(
    "/:id",
    UserController.getUserById
)

export const userRouter = router