import { PostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public async findPosts(){
            const postsDB: PostsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)

        return postsDB
    }

    public async findPostById(id: string){
        const [postsId]: PostsDB[] | undefined[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({ id })

        return postsId
    }

    public async insertPost(newPostDB: PostsDB){
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .insert(newPostDB)
    }

//     public async updatePostById(id: string){
//         const [posts]: PostsDB[] | undefined[] = await BaseDatabase
//         .connection(PostDatabase.TABLE_POSTS)
//         .where({ id: idToEdit })
//     }

//     public async deletePostById(id: string){
//     //     const [postIdAlreadyExists]: PostsDB[] | undefined[] = await BaseDatabase
//     //     .connection(PostDatabase.TABLE_POSTS)
//     //     .where({ id: idToDelete })

//     await BaseDatabase
//     .connection(PostDatabase.TABLE_POSTS)
//     .delete()
//     .where({ id })
// }

}