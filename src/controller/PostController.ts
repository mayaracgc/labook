import { Request, Response } from 'express'
import { PostBusiness } from '../business/PostBusiness'
import { BaseError } from '../errors/BaseError'

export class PostController{
    public getPosts = async (req: Request, res: Response) => {
        try {
            const postBusiness = new PostBusiness()
            const output = await postBusiness.getPosts()
    
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

    public createPosts = async (req: Request, res: Response) => {
        try {
            const { id, creatorId, content, likes, dislikes } = req.body

            const input = {
                id,
                creatorId,
                content,
                likes,
                dislikes
            }

            const postBusiness = new PostBusiness()
            const output = await postBusiness.createPost(input)
    
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

    public updatePosts = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const value = req.body.value

            const postBusiness  = new PostBusiness()
            const output = await postBusiness.updatePosts(id, value)

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

    public deletePosts = async (req: Request, res: Response) => {
        try {
            const input = {
                idToDelete: req.params.id
            } 

            const postBusiness = new PostBusiness()
            const output = await postBusiness.deletePosts(input)
    
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
}