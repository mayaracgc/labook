import { Request, Response } from 'express'
import { PostBusiness } from '../business/PostBusiness'
import { PostDTO } from '../dtos/PostDTO'
import { BaseError } from '../errors/BaseError'

export class PostController{
    constructor (
        private postDTO: PostDTO,
        private postBisness: PostBusiness
    ){}

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = {
                q: req.query.q
            }

            // const postBusiness = new PostBusiness()
            const output = await this.postBisness.getPosts(input)
    
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
            // const { id, creatorId, content, likes, dislikes } = req.body

            // const input = {
            //     id,
            //     creatorId,
            //     content,
            //     likes,
            //     dislikes
            // }
            // const postDTO = new PostDTO()
            const input = this.postDTO.createPostInput(
                req.body.id,
                req.body.creatorId,
                req.body.content
            )

            // const postBusiness = new PostBusiness()
            const output = await this.postBisness.createPost(input)
    
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
            const input = this.postDTO.updatePostInput(
                req.params.id,
                req.body.value
            )

            // const postBusiness  = new PostBusiness()
            const output = await this.postBisness.updatePosts(input)

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

            // const postBusiness = new PostBusiness()
            const output = await this.postBisness.deletePosts(input)
    
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