import { TPostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public async findPosts(){
        //         let postsDB

        // if (q) {
        //     const result: TPostsDB[] = await BaseDatabase
        //     .connection(PostDatabase.TABLE_POSTS)
        //     .where("id", "LIKE", `%${q}%`)
        //     .orWhere("content", "LIKE", `%${q}%`)
            
        //     postsDB = result

            const postsDB: TPostsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)

        return postsDB
    }

    public async findPostById(id: string){
        const [postsId]: TPostsDB[] | undefined[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({ id })

        return postsId
    }

    public async insertPost(newPostDB: TPostsDB){
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .insert(newPostDB)
    }

//     public async updatePostById(id: string){
//         const [posts]: TPostsDB[] | undefined[] = await BaseDatabase
//         .connection(PostDatabase.TABLE_POSTS)
//         .where({ id: idToEdit })
//     }

//     public async deletePostById(id: string){
//     //     const [postIdAlreadyExists]: TPostsDB[] | undefined[] = await BaseDatabase
//     //     .connection(PostDatabase.TABLE_POSTS)
//     //     .where({ id: idToDelete })

//     await BaseDatabase
//     .connection(PostDatabase.TABLE_POSTS)
//     .delete()
//     .where({ id })
// }

}