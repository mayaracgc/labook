import express, { Request, Response } from 'express'
import { UserController } from '../controller/UserController'

export const userRouter = express.Router()

const userController = new UserController()

// userRouter.get("/", userController.getUsers)
// userRouter.post("/", userController.createUser)
// userRouter.put("/:id", userController.editUser)
// userRouter.delete("/:id", userController.deleteUser)