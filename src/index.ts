import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './routers/userRouter'
import knex from 'knex'
import { BaseDatabase } from './database/BaseDatabase'
import { TLikesDislikesDB, TPostsDB, TPostsWithUsers, TUserDB } from './types'
import { User } from './models/User'
import { Post } from './models/Post'
import { UserDatabase } from './database/UserDatabase'
import { PostDatabase } from './database/PostDatabase'
import { UserController } from './controller/UserController'
import { PostController } from './controller/PostController'


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

const userController = new UserController() //instanciando a classe
const postController = new PostController()

app.get("/users", userController.getUsers)

app.post("/users", userController.createUsers)

// app.delete("/users/:id", userController.deleteUsers)


app.get("/posts", postController.getPosts)

app.post("/posts", postController.createPosts)

// app.put("/posts/:id", postController.updatePosts)

// app.delete("/posts/:id", postController.deletePosts)

// app.post("/posts/:postId/users/userId", async (req: Request, res: Response) => {
//     try {
//         const postId = req.params.postId
//         const userId = req.params.userId
//         const newLike = req.params.like


//         if (postId[0] !== "p") {
//             res.status(400)
//             throw new Error("'postId' deve iniciar com a letra 'p'")
//         }
//         if (userId[0] !== "u") {
//             res.status(400)
//             throw new Error("'userId' deve iniciar com a letra 'u'")
//         }
//         if (newLike !== undefined) {
//             if (typeof newLike !== "number") {
//                 res.status(400)
//                 throw new Error("'like' deve ser number")
//             }
//         }

//         const [post]: TPostsDB[] | undefined[] = await db("posts").where({ id: postId })

//         if (!post) {
//             res.status(404)
//             throw new Error("'postId' não encontrado")
//         }
//         const [user]: TUserDB[] | undefined[] = await db("users").where({ id: userId })

//         if (!user) {
//             res.status(404)
//             throw new Error("'userId' não encontrado")
//         }

//         const newLikesDislikes: TLikesDislikesDB = {
//             user_id: userId,
//             post_id: postId,
//             like: newLike
//         }

//         await db("likes_dislikes").insert(newLikesDislikes)

//         res.status(201).send({ message: 'Like' })

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

// app.delete("/posts/:postId/users/userId", async (req: Request, res: Response) => {
//     try {
//         const postIdToDelete = req.params.postId
//         const userIdToDelete = req.params.userId


//         if (postIdToDelete[0] !== "p") {
//             res.status(400)
//             throw new Error("'postId' deve iniciar com a letra 'p'")
//         }
//         if (userIdToDelete[0] !== "u") {
//             res.status(400)
//             throw new Error("'userId' deve iniciar com a letra 'u'")
//         }

//         const [post]: TPostsDB[] | undefined[] = await db("posts").where({ id: postIdToDelete })

//         if (!post) {
//             res.status(404)
//             throw new Error("'postId' não encontrado")
//         }
//         const [user]: TUserDB[] | undefined[] = await db("users").where({ id: userIdToDelete })

//         if (!user) {
//             res.status(404)
//             throw new Error("'userId' não encontrado")
//         }

//         await db("likes_dislikes").del()
//             .where({ post_id: postIdToDelete })
//             .andWhere({ user_id: userIdToDelete })

//         res.status(201).send({ message: 'Dislike' })

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