import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserDTO } from "../dtos/UserDTO"
import { BaseError } from "../errors/BaseError"

export class UserController {
    constructor (
        private userDTO: UserDTO,
        private userBisness: UserBusiness
    ){}

    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined

            // const userBusiness = new UserBusiness()
            const output = await this.userBisness.getUsers(q)

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
            // const { id, name, email, password } = req.body

            // const input = {
            //     id,
            //     name,
            //     email,
            //     password
            // }

            // const userDTO = new UserDTO()
            const input = this.userDTO.createUserInput(
                req.body.id,
                req.body.name,
                req.body.email,
                req.body.password
            )

            // const userBusiness = new UserBusiness()
            const output = await this.userBisness.createUsers(input)

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