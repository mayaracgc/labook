import express, { Request, Response } from 'express'
import { PostController } from '../controller/PostController'


export const postRouter = express.Router()

const postController = new PostController()

postRouter.get("/", postController.getPosts)
postRouter.post("/", postController.createPosts)
postRouter.put("/:id", postController.updatePosts)
postRouter.delete("/:id", postController.deletePosts)