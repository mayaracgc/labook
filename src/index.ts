import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './routers/userRouter'
import knex from 'knex'
import { db } from './database/BaseDatabase'
import { TUserDB } from './types'


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        // const result = await db("users")
        res.status(200).send({ message: "Pong!!!!!" }) //colocar result aqui
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
})

// rotas
// app.use("/users", userRouter)

app.get("/users", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined

        if(q === undefined){
            const result = await db("users")
            res.status(200).send(result)
        }else{
            const result = await db("users").where("name", "LIKE", `%${q}%`)
            res.status(200).send(result)
        }

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
})

app.post("/users", async (req: Request, res: Response) => {
    try {
        const { id, name, email, password, role, created_at } = req.body

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

        const [userIdAlreadyExists]: TUserDB[] | undefined[] = await db("users").where({id})

        if (userIdAlreadyExists){
            res.status(400)
            throw new Error("'id' já existe")
        }

        
        const [userEmailAlreadyExists]: TUserDB[] | undefined[] = await db("users").where({email})

        if (userEmailAlreadyExists){
            res.status(400)
            throw new Error("'email' já existe")
        }

        const newUser: TUserDB = {
            id,
            name,
            email,
            password,
            role,
            created_at
        }

        await db("users").insert(newUser)

        res.status(201).send({
            message:"User criado com sucesso",
            user: newUser
        })

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
})

