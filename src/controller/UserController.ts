import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { UserDB } from "../types"

export class UserController {
    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined
            const userDatabase = new UserDatabase()
            const usersDB = await userDatabase.findUsers(q)

            const users: User[] = usersDB.map((userDB) =>
                new User(
                    userDB.id,
                    userDB.name,
                    userDB.email,
                    userDB.password,
                    userDB.role,
                    userDB.created_at
                )
            )
            res.status(200).send(users)

        } catch (error) {
            console.log(error)

            if (req.statusCode === 200) {
                res.status(500)
            }

            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public createUsers = async (req: Request, res: Response) => {
        try {
            const { id, name, email, password, role } = req.body

            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (typeof name !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (typeof email !== "string") {
                res.status(400)
                throw new Error("'email' deve ser string")
            }

            if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
                throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
            }

            const userDatabase = new UserDatabase()

            const userIdAlreadyExists = await userDatabase.findUserById(id)
            if (userIdAlreadyExists) {
                res.status(400)
                throw new Error("'id' já existe")
            }

            const userEmailAlreadyExists = await userDatabase.findUserByEmail(email)
            if (userEmailAlreadyExists) {
                res.status(400)
                throw new Error("'email' já existe")
            }

            const newUser = new User(
                id,
                name,
                email,
                password,
                role,
                new Date().toISOString()
            )
            const newUserDB: UserDB = {
                id: newUser.getId(),
                name: newUser.getName(),
                email: newUser.getEmail(),
                password: newUser.getPassword(),
                role: newUser.getRole(),
                created_at: newUser.getCreatedAt()
            }

            await userDatabase.insertUser(newUserDB)

            res.status(201).send(newUser)

        } catch (error) {
            console.log(error)

            if (req.statusCode === 200) {
                res.status(500)
            }

            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

}

