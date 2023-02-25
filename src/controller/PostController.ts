import { Request, Response } from 'express'
import { PostDatabase } from '../database/PostDatabase'
import { Post } from '../models/Post'
import { TPostsDB } from '../types'

export class PostController{
    public getPosts = async (req: Request, res: Response) => {
        try {
            const postDatabase = new PostDatabase()
            const postsDB = await postDatabase.findPosts()
    
            const posts: Post[] = postsDB.map((postDB) =>
            new Post(
                postDB.id,
                postDB.creator_id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at
            ))
    
            res.status(200).send(posts)
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

    public createPosts = async (req: Request, res: Response) => {
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
    
            const postDatabase = new PostDatabase()
            const postsIdAlreadyExists = await postDatabase.findPostById(id)
    
            if (postsIdAlreadyExists) {
                res.status(400)
                throw new Error("'id' já existe")
            }
    
            const newPosts = new Post (
                id,
                creatorId,
                content,
                likes,
                dislikes,
                new Date().toISOString(),
                new Date().toISOString()
            )
            const newPostDB: TPostsDB = {
                id: newPosts.getId(),
                creator_id: newPosts.getCreatorId(),
                content: newPosts.getContent(),
                likes: newPosts.getLikes(),
                dislikes: newPosts.getDislikes(),
                created_at: newPosts.getCreatedAt(),
                updated_at: newPosts.getUpdatedAt()
            }
    
            await postDatabase.insertPost(newPostDB)
            // const [ postsDB ]: TPostsDB[] = await db("posts").where({ id })
    
            res.status(201).send(newPosts)
    
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

    // public updatePosts = async (req: Request, res: Response) => {
    //     try {
    //         const idToEdit = req.params.id
    
    //         const newId = req.body.id
    //         const newCreatorId = req.body.creatorId
    //         const newContent = req.body.content
    //         const newLikes = req.body.likes
    //         const newDislikes = req.body.dislikes
    //         const newCreatedAt = req.body.createdAt
    //         const newUpdateAt = req.body.updatedAt
    
    //         if (newId !== undefined) {
    //             if (typeof newId !== "string") {
    //                 res.status(400)
    //                 throw new Error("'id' deve ser string")
    //             }
    //         }
    //         if (newCreatorId !== undefined) {
    //             if (typeof newCreatorId !== "string") {
    //                 res.status(400)
    //                 throw new Error("'creatorId' deve ser string")
    //             }
    //         }
    //         if (newContent !== undefined) {
    //             if (typeof newContent !== "string") {
    //                 res.status(400)
    //                 throw new Error("'content' deve ser string")
    //             }
    //         }
    //         if (newLikes !== undefined) {
    //             if (typeof newLikes !== "number") {
    //                 res.status(400)
    //                 throw new Error("'like' deve ser number")
    //             }
    //         }
    //         if (newDislikes !== undefined) {
    //             if (typeof newDislikes !== "number") {
    //                 res.status(400)
    //                 throw new Error("'dislike' deve ser number")
    //             }
    //         }
    //         if (newCreatedAt !== undefined) {
    //             if (typeof newCreatedAt !== "string") {
    //                 res.status(400)
    //                 throw new Error("'createdAt' deve ser string")
    //             }
    //         }
    //         if (newUpdateAt !== undefined) {
    //             if (typeof newUpdateAt !== "string") {
    //                 res.status(400)
    //                 throw new Error("'updatedAt' deve ser string")
    //             }
    //         }
    
    //         // const [posts]: TPostsDB[] | undefined[] = await db("posts").where({ id: idToEdit })
    //         const postDatabase = new PostDatabase()
    
    //         const posts = await postDatabase.updatePostById(id: idToEdit)
    //         if (!posts) {
    //             res.status(404)
    //             throw new Error("'id' não encontrado")
    //         }
    
    
    //         const newPosts: TPostsDB = {
    //             id: newId || posts.id,
    //             creator_id: newCreatorId || posts.creator_id,
    //             content: newContent || posts.content,
    //             likes: isNaN(newLikes) ? posts.likes : newLikes,
    //             dislikes: isNaN(newDislikes) ? posts.dislikes : newDislikes,
    //             created_at: newCreatedAt || posts.created_at,
    //             updated_at: newUpdateAt || posts.updated_at
    //         }
    
    //         await postDatabase.updatePostById(newPosts)
    
    //         res.status(200).send({
    //             message: "Post editada com sucesso",
    //             post: newPosts
    //         })
    
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
    // }

    
}

// public deletePosts = async (req: Request, res: Response) => {
//     try {
//         const idToDelete = req.params.id

//         if (idToDelete[0] !== "p") {
//             res.status(400)
//             throw new Error("'id' deve iniciar com a letra 'p'")
//         }

//         const postDatabase = new PostDatabase()

//         const postIdAlreadyExists = await postDatabase.deletePostById(idToDelete)

//         if (!postIdAlreadyExists) {
//             res.status(404)
//             throw new Error("'id' não encontrado")
//         }

//         // await db("likes_dislikes").del().where({ posts_id: idToDelete })
//         await postDatabase.deletePostById(idToDelete)

//         res.status(200).send({ message: "Post deletado com sucesso" })


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
// }