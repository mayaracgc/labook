import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './routers/userRouter'
import knex from 'knex'
import { db } from './database/BaseDatabase'
import { TLikesDislikesDB, TPostsDB, TPostsWithUsers, TUserDB } from './types'


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

        if (q === undefined) {
            const result = await db("users")
            res.status(200).send(result)
        } else {
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

        const [userIdAlreadyExists]: TUserDB[] | undefined[] = await db("users").where({ id })

        if (userIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }


        const [userEmailAlreadyExists]: TUserDB[] | undefined[] = await db("users").where({ email })

        if (userEmailAlreadyExists) {
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
            message: "User criado com sucesso",
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

app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if (idToDelete[0] !== "u") {
            res.status(400)
            throw new Error("'id' deve iniciar com a letra 'u'")
        }

        const [userIdAlreadyExists]: TUserDB[] | undefined[] = await db("users").where({ id: idToDelete })

        if (!userIdAlreadyExists) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        await db("users").del().where({ id: idToDelete })

        res.status(200).send({ message: "User deletado com sucesso" })

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

app.get("/posts", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined

        if (q === undefined) {
            const result = await db("posts")
            res.status(200).send(result)
        } else {
            const result = await db("posts")
                .where("id", "LIKE", `%${q}%`)
                .orWhere("content", "LIKE", `%${q}%`)

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

app.post("/posts", async (req: Request, res: Response) => {
    try {
        const { id, creatorId, content, likes, dislikes } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof creatorId !== "string") {
            res.status(400)
            throw new Error("'creator_id' deve ser string")
        }

        if (typeof content !== "string") {
            res.status(400)
            throw new Error("'content' deve ser string")
        }


        const [postsIdAlreadyExists]: TPostsDB[] | undefined[] = await db("posts").where({ id })

        if (postsIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }


        const newPosts = {
            id,
            creatorId,
            content,
            likes,
            dislikes
        }

        await db("posts").insert(newPosts)

        const [insertedPost]: TPostsDB[] = await db("posts").where({ id })

        res.status(201).send({
            message: "Post criado com sucesso",
            post: insertedPost
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

app.put("/posts/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newCreatorId = req.body.creatorId
        const newContent = req.body.content
        const newLikes = req.body.likes
        const newDislikes = req.body.dislikes
        const newCreatedAt = req.body.createdAt
        const newUpdateAt = req.body.updatedAt

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }
        }
        if (newCreatorId !== undefined) {
            if (typeof newCreatorId !== "string") {
                res.status(400)
                throw new Error("'creatorId' deve ser string")
            }
        }
        if (newContent !== undefined) {
            if (typeof newContent !== "string") {
                res.status(400)
                throw new Error("'content' deve ser string")
            }
        }
        if (newLikes !== undefined) {
            if (typeof newLikes !== "number") {
                res.status(400)
                throw new Error("'like' deve ser number")
            }
        }
        if (newDislikes !== undefined) {
            if (typeof newDislikes !== "number") {
                res.status(400)
                throw new Error("'dislike' deve ser number")
            }
        }
        if (newCreatedAt !== undefined) {
            if (typeof newCreatedAt !== "string") {
                res.status(400)
                throw new Error("'createdAt' deve ser string")
            }
        }
        if (newUpdateAt !== undefined) {
            if (typeof newUpdateAt !== "string") {
                res.status(400)
                throw new Error("'updatedAt' deve ser string")
            }
        }

        const [posts]: TPostsDB[] | undefined[] = await db("posts").where({ id: idToEdit })

        if (!posts) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }


        const newPosts: TPostsDB = {
            id: newId || posts.id,
            creator_id: newCreatorId || posts.creator_id,
            content: newContent || posts.content,
            likes: isNaN(newLikes) ? posts.likes : newLikes,
            dislikes: isNaN(newDislikes) ? posts.dislikes : newDislikes,
            created_at: newCreatedAt || posts.created_at,
            updated_at: newUpdateAt || posts.updated_at
        }

        await db("posts").update(newPosts).where({ id: idToEdit })


        res.status(200).send({
            message: "Post editada com sucesso",
            post: newPosts
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

app.delete("/posts/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if (idToDelete[0] !== "p") {
            res.status(400)
            throw new Error("'id' deve iniciar com a letra 'p'")
        }

        const [userIdAlreadyExists]: TPostsDB[] | undefined[] = await db("posts").where({ id: idToDelete })

        if (!userIdAlreadyExists) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        await db("likes_dislikes").del().where({ posts_id: idToDelete })
        await db("posts").del().where({ id: idToDelete })

        res.status(200).send({ message: "Post deletado com sucesso" })


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


app.post("/posts/:postId/users/userId", async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId
        const userId = req.params.userId
        const newLike = req.params.like


        if (postId[0] !== "p") {
            res.status(400)
            throw new Error("'postId' deve iniciar com a letra 'p'")
        }
        if (userId[0] !== "u") {
            res.status(400)
            throw new Error("'userId' deve iniciar com a letra 'u'")
        }
        if (newLike !== undefined) {
            if (typeof newLike !== "number") {
                res.status(400)
                throw new Error("'like' deve ser number")
            }
        }

        const [post]: TPostsDB[] | undefined[] = await db("posts").where({ id: postId })

        if (!post) {
            res.status(404)
            throw new Error("'postId' não encontrado")
        }
        const [user]: TUserDB[] | undefined[] = await db("users").where({ id: userId })

        if (!user) {
            res.status(404)
            throw new Error("'userId' não encontrado")
        }

        const newLikesDislikes: TLikesDislikesDB = {
            user_id: userId,
            post_id: postId,
            like: newLike
        }

        await db("likes_dislikes").insert(newLikesDislikes)

        res.status(201).send({ message: 'Like' })

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

app.delete("/posts/:postId/users/userId", async (req: Request, res: Response) => {
    try {
        const postIdToDelete = req.params.postId
        const userIdToDelete = req.params.userId


        if (postIdToDelete[0] !== "p") {
            res.status(400)
            throw new Error("'postId' deve iniciar com a letra 'p'")
        }
        if (userIdToDelete[0] !== "u") {
            res.status(400)
            throw new Error("'userId' deve iniciar com a letra 'u'")
        }

        const [post]: TPostsDB[] | undefined[] = await db("posts").where({ id: postIdToDelete })

        if (!post) {
            res.status(404)
            throw new Error("'postId' não encontrado")
        }
        const [user]: TUserDB[] | undefined[] = await db("users").where({ id: userIdToDelete })

        if (!user) {
            res.status(404)
            throw new Error("'userId' não encontrado")
        }

        await db("likes_dislikes").del()
            .where({ post_id: postIdToDelete })
            .andWhere({ user_id: userIdToDelete })

        res.status(201).send({ message: 'Dislike' })

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

// app.get("/posts/users", async (req: Request, res: Response) => {
//     try {
//         const posts: TPostsDB[] = await db("posts")

//         const result: TPostsWithUsers[] = []

//         for (let post of posts) {
//             const like = []
//             const like_dislike: TLikesDislikesDB[] = await db("likes_dislikes").where({ post_id: posts.id })
            
//             for (let like_dislike of likes_dislikes) {
//                 const [ user ]: TUserDB[] = await db("users").where({ id: like_dislike.user_id })
//                 like.push(user)
//             }

//             const newPostsWithUsers: TPostsWithUsers = {
//                 ...post,
//                 like
//             }

//             result.push(newPostsWithUsers)
//         }

//         res.status(200).send(result)

//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })