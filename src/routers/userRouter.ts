import express, { Request, Response } from 'express'
import { UserController } from '../controller/UserController'

export const userRouter = express.Router()

const userController = new UserController()
