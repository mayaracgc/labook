import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, PostDTO, UpdatePostInputDTO } from "../dtos/PostDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { PostsDB } from "../types"

export class PostBusiness {
    constructor(
        private postDTO: PostDTO,

        private postDatabase: PostDatabase
    ){} 

    public async getPosts(input: any ){
        const { q } = input

        // const postDatabase = new PostDatabase()
        const postsDB = await this.postDatabase.findPosts(q)

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
        return posts
    }

    public async createPost(input: CreatePostInputDTO){

        const { id, creatorId, content } = input

        // const postDatabase = new PostDatabase()
        const postsIdAlreadyExists = await this.postDatabase.findPostById(id)

        if (postsIdAlreadyExists) {
            throw new BadRequestError("'id' já existe")
        }

        const newPosts = new Post (
            id,
            creatorId,
            content,
            1,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )
        const newPostDB: PostsDB = {
            id: newPosts.getId(),
            creator_id: newPosts.getCreatorId(),
            content: newPosts.getContent(),
            likes: newPosts.getLikes(),
            dislikes: newPosts.getDislikes(),
            created_at: newPosts.getCreatedAt(),
            updated_at: newPosts.getUpdatedAt()
        }

        await this.postDatabase.insertPost(newPostDB)

        // const postDTO = new PostDTO()
        const output = this.postDTO.createPostOutput(newPosts)

        return output
    }

    public async updatePosts(input: UpdatePostInputDTO){

        const { id, value } = input
        // const postDatabase = new PostDatabase()
        const postsDB = await this.postDatabase.findPostById(id)

        if (!postsDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const post = new Post (
            postsDB.id,
            postsDB.creator_id,
            postsDB.content,
            postsDB.likes,
            postsDB.dislikes,
            postsDB.created_at,
            postsDB.updated_at
        )

        const newContent = post.getContent() + value
        post.setContent(newContent)

        await this.postDatabase.updatePostById(id, newContent)
        const output = this.postDTO.updatePostOutput(post)

        return output
    }

    public async deletePosts (input: any){
        const { idToDelete } = input

        if (idToDelete[0] !== "p") { //não necessario
            throw new Error("'id' deve iniciar com a letra 'p'")
        }

        // const postDatabase = new PostDatabase()

        const postToDeleteDB = await this.postDatabase.findPostById(idToDelete)

        if (!postToDeleteDB ) {
            throw new NotFoundError("'id' não encontrado")
        }

        await this.postDatabase.deletePostById(postToDeleteDB.id)

        const output = {
            message: "Post deletado com sucesso"
        }
        return output
    }
}