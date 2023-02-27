import { PostDatabase } from "../database/PostDatabase"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Post } from "../models/Post"
import { PostsDB } from "../types"

export class PostBusiness {
    public async getPosts(){
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
        return posts
    }

    public async createPost(input: any){

        const { id, creatorId, content } = input
            
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof creatorId !== "string") {
            throw new BadRequestError("'creator_id' deve ser string")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const postDatabase = new PostDatabase()
        const postsIdAlreadyExists = await postDatabase.findPostById(id)

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

        await postDatabase.insertPost(newPostDB)
        return newPostDB
    }

    public async updatePosts(id: string, value: string){
        
            if (typeof value !== "string") {
                throw new BadRequestError("'content' deve ser string")
            }

        const postDatabase = new PostDatabase()
        const postsDB = await postDatabase.findPostById(id)

        if (!postsDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const posts = new Post (
            postsDB.id,
            postsDB.creator_id,
            postsDB.content,
            postsDB.likes,
            postsDB.dislikes,
            postsDB.created_at,
            postsDB.updated_at
        )

        const newContent = posts.getContent() + value
        posts.setContent(newContent)

        await postDatabase.updatePostById(id, newContent)

        return newContent
    }

    public async deletePosts (input: any){
        const { idToDelete } = input

        if (idToDelete[0] !== "p") { //não necessario
            throw new Error("'id' deve iniciar com a letra 'p'")
        }

        const postDatabase = new PostDatabase()

        const postToDeleteDB = await postDatabase.findPostById(idToDelete)

        if (!postToDeleteDB ) {
            throw new NotFoundError("'id' não encontrado")
        }

        await postDatabase.deletePostById(postToDeleteDB.id)

        const output = {
            message: "Post deletado com sucesso"
        }
        return output
    }
}