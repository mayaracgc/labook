import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { BaseError } from "../errors/BaseError"

export class UserController {
    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined

            const userBusiness = new UserBusiness()
            const output = await userBusiness.getUsers(q)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createUsers = async (req: Request, res: Response) => {
        try {
            const { id, name, email, password } = req.body

            const input = {
                id,
                name,
                email,
                password
            }

            const userBusiness = new UserBusiness()
            const output = await userBusiness.createUsers(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

}