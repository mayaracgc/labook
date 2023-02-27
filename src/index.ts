import express from 'express'
import cors from 'cors'
import { UserController } from './controller/UserController'
import { PostController } from './controller/PostController'


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})


const userController = new UserController() //instanciando a classe
const postController = new PostController()

app.get("/users", userController.getUsers)

app.post("/users", userController.createUsers)


app.get("/posts", postController.getPosts)

app.post("/posts", postController.createPosts)

// app.put("/posts/:id", postController.updatePosts)

// app.delete("/posts/:id", postController.deletePosts)