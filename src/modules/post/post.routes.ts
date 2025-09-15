import express from "express"
import { postController } from "./post.controller";

const router = express.Router();

router.post(
    "/",
    postController.createPost
)
router.get(
    "/",
    postController.getAllPosts
)
router.get(
    "/:id",
    postController.getPostsById
)
router.delete(
    "/:id",
    postController.postDeleted
)
router.patch(
    "/:id",
    postController.postUpdated
)


export const postRouter = router