import express, { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"

export class UserController {
    constructor() { }

    // public getUsers = async (req: Request, res: Response) => {
    //     try {
    //         const input = {
    //             q: req.query.q
    //         }

    //         const userBusiness = new UserBusiness()
    //         const output = await UserBusiness.getUsers(input)

    //         res.status(200).send(output)

    //     } catch (error) {
    //         console.log(error)

    //         if (error instanceof BaseError) {
    //             res.status(error.statusCode).send(error.message)
    //         } else {
    //             res.status(500).send("Erro inesperado")
    //         }
    //     }
    // }
}