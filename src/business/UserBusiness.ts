import { UserDatabase } from "../database/UserDatabase"
import { BadRequestError } from "../errors/BadRequestError"
import { User } from "../models/User"
import { UserDB, USER_ROLES } from "../types"

export class UserBusiness {
    public async getUsers(q: string | undefined){
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
        return users
    }

    public async createUsers(input: any){

        const { id, name, email, password } = input

        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            throw new BadRequestError("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        const userDatabase = new UserDatabase()

        const userIdAlreadyExists = await userDatabase.findUserById(id)
        if (userIdAlreadyExists) {
            throw new BadRequestError("'id' já existe")
        }

        const userEmailAlreadyExists = await userDatabase.findUserByEmail(email)
        if (userEmailAlreadyExists) {
            throw new BadRequestError("'email' já existe")
        }

        const newUser = new User(
            id,
            name,
            email,
            password,
            USER_ROLES.NORMAL,
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

        return newUserDB
    }
}