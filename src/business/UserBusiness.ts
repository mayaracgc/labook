import { UserDatabase } from "../database/UserDatabase"
import { CreateUserInputDTO, UserDTO } from "../dtos/UserDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { User } from "../models/User"
import { UserDB, USER_ROLES } from "../types"

export class UserBusiness {
    constructor (
        private userDTO: UserDTO,
        private userDatabase: UserDatabase
    ){}

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

    public async createUsers(input: CreateUserInputDTO){

        const { id, name, email, password } = input

        // const userDatabase = new UserDatabase()

        const userIdAlreadyExists = await this.userDatabase.findUserById(id)
        if (userIdAlreadyExists) {
            throw new BadRequestError("'id' já existe")
        }

        const userEmailAlreadyExists = await this.userDatabase.findUserByEmail(email)
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

        await this.userDatabase.insertUser(newUserDB)

        // const output = {
        //     message: "Usuário registrado com sucesso!",
        //     user: newUser
        // }
        // const userDTO = new UserDTO()
        const output = this.userDTO.createUserOutput(newUser)

        return output
    }
}