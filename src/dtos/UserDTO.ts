import { BadRequestError } from "../errors/BadRequestError"
import { User } from "../models/User"

export interface CreateUserInputDTO{
    id: string,
    name: string,
    email: string,
    password: string
}

export interface CreateUserOutDTO{
    message: string,
    user: {
        id: string,
        name: string,
        email: string,
        password: string,
        role: string,
        createdAt: string
    }
}

export class UserDTO {
    public createUserInput(
        id: unknown,
        name: unknown,
        email: unknown,
        password: string
    ): CreateUserInputDTO
    {
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

        const dto: CreateUserInputDTO = {
            id,
            name,
            email,
            password
        }
        
        return dto
    }

    public createUserOutput(user: User): CreateUserOutDTO
    {
        const dto: CreateUserOutDTO = {
            message: "Usuário registrado com sucesso!",
            user: {
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                password: user.getPassword(),
                role: user.getRole(),
                createdAt: user.getCreatedAt()
            }
        }

        return dto
    }
}